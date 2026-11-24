import { useEffect, useState } from "react";
import { MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { listConversations } from "../../services/messageService";

export default function MessageBadge({ role }) {
  const [unread, setUnread] = useState(0);
  useEffect(() => {
    let active = true;
    async function refresh() {
      try {
        const conversations = await listConversations();
        if (active) setUnread(conversations.reduce((count, conversation) => count + conversation.unread, 0));
      } catch {
        // Keep the last count until the next refresh.
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
  return (
    <Link to={`/${role}/messages`} aria-label={`Messages, ${unread} unread`}
      title="Messages"
      className="relative grid size-11 place-items-center rounded-xl border border-zinc-800 text-zinc-300 hover:bg-zinc-800 focus-visible:ring-2 focus-visible:ring-indigo-300">
      <MessageSquare size={20} aria-hidden="true" />
      {unread > 0 && <span aria-hidden="true" className="absolute -right-1 -top-1 rounded-full bg-indigo-500 px-1.5 text-xs font-semibold text-white">{unread > 99 ? "99+" : unread}</span>}
    </Link>
  );
}
