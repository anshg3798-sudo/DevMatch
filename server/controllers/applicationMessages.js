const { Types } = require("mongoose");
const Application = require("../models/Application");
const Project = require("../models/Project");

async function conversationAccess(req) {
  if (!Types.ObjectId.isValid(req.params.applicationId)) return null;
  const application = await Application.findById(req.params.applicationId)
    .select("student project status lastMessageAt")
    .populate("project", "createdBy");
  if (!application?.project) return null;
  const { id, role } = req.user;
  if (role === "student" && String(application.student) === id) return application;
  if (role === "recruiter" && String(application.project.createdBy) === id) return application;
  return null;
}

async function listConversations(req, res) {
  res.set("Cache-Control", "no-store");
  const { id, role } = req.user;
  if (!["student", "recruiter"].includes(role)) return res.sendStatus(403);
  const participant = role === "student" ? { student: id } : {
    project: { $in: await Project.distinct("_id", { createdBy: id }) },
  };
  const applications = await Application.find({
    ...participant,
    $or: [{ status: "Accepted" }, { lastMessageAt: { $exists: true } }],
  }).select("project student status lastMessageAt studentUnread recruiterUnread")
    .populate("project", "title")
    .populate("student", "name")
    .sort({ lastMessageAt: -1, _id: -1 });
  const conversations = applications.filter((application) => application.project).map((application) => ({
    id: application.id,
    project: application.project.title,
    student: role === "recruiter" ? application.student?.name : undefined,
    status: application.status,
    unread: application[`${role}Unread`] || 0,
  }));
  return res.json({ conversations });
}

async function openConversation(req, res) {
  const application = await conversationAccess(req);
  if (!application || (application.status !== "Accepted" && !application.lastMessageAt)) {
    return res.status(404).json({ message: "Conversation unavailable." });
  }
  const filter = {
    _id: application._id,
    $or: [{ status: "Accepted" }, { lastMessageAt: { $exists: true } }],
  };
  const unread = `${req.user.role}Unread`;
  // A message arriving after this operation remains unread.
  const thread = await Application.findOneAndUpdate(filter, { $set: { [unread]: 0 } },
    { returnDocument: "before", timestamps: false }).select(`status messages ${unread}`);
  if (!thread) return res.status(404).json({ message: "Conversation unavailable." });
  return res.json({ status: thread.status, messages: thread.messages || [], clearedUnread: Boolean(thread[unread]) });
}

async function sendMessage(req, res) {
  const text = typeof req.body?.text === "string" ? req.body.text.trim() : "";
  if (!text || text.length > 2000) {
    return res.status(400).json({ message: "Enter a message between 1 and 2,000 characters." });
  }
  const application = await conversationAccess(req);
  if (!application) return res.status(404).json({ message: "Conversation unavailable." });
  const senderRole = req.user.role;
  const unread = senderRole === "student" ? "recruiterUnread" : "studentUnread";
  const sentAt = new Date();
  try {
    const result = await Application.updateOne({ _id: application._id, status: "Accepted" }, {
      $push: { messages: { senderRole, text, sentAt } },
      $set: { lastMessageAt: sentAt },
      $inc: { [unread]: 1 },
    }, { runValidators: true, timestamps: false });
    if (!result.matchedCount) {
      return res.status(409).json({ message: "Messaging opens when the application is accepted." });
    }
  } catch (error) {
    if (error.code === 10334) return res.status(413).json({ message: "This conversation has reached its storage limit." });
    throw error;
  }
  return res.status(201).json({ success: true });
}

module.exports = { listConversations, openConversation, sendMessage };
