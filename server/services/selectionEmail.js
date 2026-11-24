const Application = require("../models/Application");

const retryDelay = 60 * 1000;
const retryWindow = 23 * 60 * 60 * 1000;
let running = false;

async function deliverSelectionEmails() {
  if (running || !process.env.RESEND_API_KEY || !process.env.SELECTION_EMAIL_FROM) return;
  running = true;

  try {
    for (let count = 0; count < 10; count += 1) {
      const now = new Date();
      const application = await Application.findOneAndUpdate({
        "selectionEmail.nextAttemptAt": { $lte: now },
        $or: [
          { "selectionEmail.retryUntil": null },
          { "selectionEmail.retryUntil": { $gt: now } },
        ],
      }, [{
        $set: {
          "selectionEmail.nextAttemptAt": new Date(now.getTime() + retryDelay),
          "selectionEmail.retryUntil": {
            $ifNull: ["$selectionEmail.retryUntil", new Date(now.getTime() + retryWindow)],
          },
        },
      }], { returnDocument: "after", updatePipeline: true, timestamps: false }).select("+selectionEmail");

      if (!application) break;

      const email = application.selectionEmail;
      const rejected = email.status === "Rejected";
      const message = rejected
        ? `Thank you for applying to "${email.projectTitle}". The recruiter has decided not to move forward with your application. You can continue browsing and applying to other projects on DevMatch.`
        : `Congratulations! Your application for "${email.projectTitle}" has been accepted. The recruiter will contact you about the next steps.`;
      try {
        const response = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
            "Idempotency-Key": `devmatch-selection/${application.id}${email.decisionId ? `/${email.decisionId}` : ""}`,
          },
          body: JSON.stringify({
            from: process.env.SELECTION_EMAIL_FROM,
            to: [email.to],
            subject: rejected ? "Your DevMatch application was rejected" : "Your DevMatch application was accepted",
            // Keep the original payload for queued emails that already have an idempotency key.
            text: email.decisionId ? message : `Congratulations! Your application for "${email.projectTitle}" was accepted. Sign in to DevMatch to view your application.`,
          }),
          redirect: "error",
          signal: AbortSignal.timeout(10000),
        });
        if (!response.ok) throw new Error(`Resend returned HTTP ${response.status}`);

        await Application.updateOne({
          _id: application._id,
          "selectionEmail.decisionId": email.decisionId ?? { $exists: false },
        }, {
          $set: { selectionEmail: { sentAt: new Date() } },
        }, { timestamps: false });
      } catch (error) {
        console.warn("Selection email attempt failed:", application.id, error.message);
      }
    }
  } catch (error) {
    console.warn("Unable to process selection emails:", error.name);
  } finally {
    running = false;
  }
}

function startSelectionEmailWorker() {
  if (!process.env.RESEND_API_KEY || !process.env.SELECTION_EMAIL_FROM) {
    console.warn("Selection emails will queue until Resend is configured.");
    return;
  }
  void deliverSelectionEmails();
  setInterval(deliverSelectionEmails, 15000).unref();
}

module.exports = { startSelectionEmailWorker, deliverSelectionEmails };

