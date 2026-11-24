import API from "../api/axios";

export async function listConversations() {
  const { data } = await API.get("/applications/conversations");
  return data.conversations;
}

export async function openConversation(id, signal) {
  const { data } = await API.post(`/applications/${id}/conversation/open`, {}, { signal });
  return data;
}

export async function sendMessage(id, text) {
  await API.post(`/applications/${id}/conversation/messages`, { text });
}
