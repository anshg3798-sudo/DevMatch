import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import StudentDashboardLayout from "../components/dashboard/StudentDashboardLayout";
import { listConversations, openConversation, sendMessage } from "../services/messageService";

export default function ApplicationMessages({ role }) {
  const [params] = useSearchParams();
  const selected = params.get("application");
  const [conversations, setConversations] = useState(null);
  const [listError, setListError] = useState("");
  const Layout = role === "student" ? StudentDashboardLayout : DashboardLayout;

  useEffect(() => {
    let active = true;
    async function refresh() {
      try {
        const items = await listConversations();
        if (active) {
          setConversations(items);
          setListError("");
        }
      } catch {
        if (active) setListError("Couldn’t load conversations. Retrying shortly.");
      }
    }
    void refresh();
    const timer = window.setInterval(refresh, 15_000);
    window.addEventListener("devmatch:conversation-read", refresh);
    return () => {
      active = false;
      window.clearInterval(timer);
      window.removeEventListener("devmatch:conversation-read", refresh);
    };
  }, []);

  const conversation = conversations?.find(({ id }) => id === selected);
  return (
    <Layout>
      <h1 className="mb-6 text-3xl font-bold text-white">Messages</h1>
      <div className="grid gap-5 lg:grid-cols-[16rem_minmax(0,1fr)]">
        <nav aria-label="Application conversations" className="rounded-xl border border-zinc-800 bg-zinc-900 p-3 text-white">
          {listError && <p role="status" className="p-2 text-sm text-red-300">{listError}</p>}
          {conversations?.length === 0 && <p className="p-2 text-sm text-zinc-400">Conversations open after an application is accepted.</p>}
          {!conversations && !listError && <p className="p-2 text-sm text-zinc-400">Loading conversations…</p>}
          {conversations?.map(({ id, project, student, unread }) => (
            <Link key={id} to={`/${role}/messages?application=${id}`} aria-current={selected === id ? "page" : undefined}
              className={`flex items-center justify-between gap-2 rounded-lg p-3 text-sm hover:bg-zinc-800 ${selected === id ? "bg-zinc-800" : ""}`}>
              <span className="min-w-0 break-words">{project}{student && <span className="block text-xs text-zinc-400">{student}</span>}</span>
              {unread > 0 && <span aria-label={`${unread} unread`} className="rounded-full bg-indigo-600 px-2 text-xs">{unread}</span>}
            </Link>
          ))}
        </nav>
        {selected ? <Thread key={selected} id={selected} role={role} title={conversation?.project} />
          : <p className="rounded-xl border border-zinc-800 p-5 text-zinc-400">Choose an application to open its conversation.</p>}
      </div>
    </Layout>
  );
}

function Thread({ id, role, title }) {
  const [thread, setThread] = useState(null);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [sendError, setSendError] = useState("");
  const end = useRef(null);
  const lastId = thread?.messages.at(-1)?._id;

  useEffect(() => {
    const controller = new AbortController();
    let latest = 0;
    async function refresh() {
      if (document.hidden) return;
      const request = ++latest;
      try {
        const data = await openConversation(id, controller.signal);
        if (controller.signal.aborted || request !== latest) return;
        setThread(data);
        setLoadError("");
        if (data.clearedUnread) window.dispatchEvent(new Event("devmatch:conversation-read"));
      } catch (failure) {
        if (controller.signal.aborted || request !== latest) return;
        if (failure.response?.status === 404) setThread(null);
        setLoadError(failure.response?.data?.message || "Couldn’t load messages. Retrying shortly.");
      }
    }
    void refresh();
    const timer = window.setInterval(refresh, 10_000);
    document.addEventListener("visibilitychange", refresh);
    window.addEventListener("devmatch:message-sent", refresh);
    return () => {
      controller.abort();
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", refresh);
      window.removeEventListener("devmatch:message-sent", refresh);
    };
  }, [id]);

  useEffect(() => {
    if (lastId && end.current) end.current.parentElement.scrollTop = end.current.parentElement.scrollHeight;
  }, [lastId]);

  async function submit(event) {
    event.preventDefault();
    if (sending || !draft.trim()) return;
    setSending(true);
    setSendError("");
    try {
      await sendMessage(id, draft);
      setDraft("");
    } catch (failure) {
      setSendError(failure.response?.data?.message || "Couldn’t send your message. Try again.");
    } finally {
      setSending(false);
      window.dispatchEvent(new Event("devmatch:message-sent"));
    }
  }

  return (
    <section className="min-w-0 rounded-xl border border-zinc-800 bg-zinc-900 p-4 text-white sm:p-5">
      <h2 className="text-lg font-semibold">{title || "Application conversation"}</h2>
      {loadError && <p role="status" className="mt-2 text-sm text-red-300">{loadError}</p>}
      {!thread && !loadError && <p className="mt-4 text-sm text-zinc-400">Loading messages…</p>}
      {thread && <>
        <ol aria-label="Messages" className="my-4 max-h-[55dvh] space-y-3 overflow-y-auto">
          {thread.messages.map((message) => {
            const own = message.senderRole === role;
            return <li key={message._id} className={`max-w-[85%] rounded-xl p-3 ${own ? "ml-auto bg-indigo-950" : "bg-zinc-800"}`}>
              <p className="text-xs text-zinc-300">{own ? "You" : message.senderRole === "student" ? "Student" : "Recruiter"} · {new Date(message.sentAt).toLocaleString()}</p>
              <p className="mt-1 whitespace-pre-wrap break-words text-sm">{message.text}</p>
            </li>;
          })}
          <li ref={end} aria-hidden="true" />
        </ol>
        {thread.messages.length === 0 && <p className="mb-4 text-sm text-zinc-400">Start the conversation with a message.</p>}
        {thread.status === "Accepted" ? <form onSubmit={submit} className="space-y-2 border-t border-zinc-800 pt-4">
          <label htmlFor="message-draft" className="block text-sm text-zinc-300">Message</label>
          <textarea id="message-draft" rows={3} maxLength={2000} value={draft} disabled={sending}
            onChange={(event) => setDraft(event.target.value)} className="w-full rounded-lg border border-zinc-700 bg-zinc-950 p-3 text-white" />
          {sendError && <p role="alert" className="text-sm text-red-300">{sendError}</p>}
          <button type="submit" disabled={sending || !draft.trim()} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold hover:bg-indigo-500 disabled:opacity-50">{sending ? "Sending…" : "Send message"}</button>
        </form> : <p className="text-sm text-zinc-400">This conversation is read-only. Messaging reopens if the application is accepted.</p>}
      </>}
    </section>
  );
}
