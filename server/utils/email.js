const normalizeEmail = (email) =>
  typeof email === "string" ? email.trim().toLowerCase() : "";

function isValidEmail(email) {
  if (typeof email !== "string" || email.length > 254) return false;
  const [local, domain, extra] = email.split("@");
  if (!domain || extra !== undefined || local.length > 64) return false;
  if (!/^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*$/i.test(local)) return false;
  const labels = domain.split(".");
  return labels.length > 1 && labels.every((label) =>
    /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/i.test(label),
  );
}

module.exports = { normalizeEmail, isValidEmail };

