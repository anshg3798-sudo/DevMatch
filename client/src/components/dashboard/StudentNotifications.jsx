import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { Link } from "react-router-dom";
import { getMyApplications } from "../../services/applicationService";

const decisionKey = (application) => application.decisionId || `${application._id}:${application.status}`;

export default function StudentNotifications({ studentId }) {
  const storageKey = `devmatch:read-decisions:${studentId}`;
  const [read, setRead] = useState(() => {
    try {
      return new Set(JSON.parse(localStorage.getItem(storageKey) || "[]"));
    } catch {
      return new Set();
    }
  });
  const [decisions, setDecisions] = useState([]);
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let active = true;
    async function refresh() {
      try {
        const { applications } = await getMyApplications();
        if (!active) return;
        setDecisions(applications.filter(({ status }) => status === "Accepted" || status === "Rejected")
          .sort((a, b) => new Date(b.decidedAt || b.updatedAt) - new Date(a.decidedAt || a.updatedAt)));
        setError(false);
      } catch {
        if (active) setError(true);
      } finally {
        if (active) setLoaded(true);
      }
    }
    void refresh();
    const timer = window.setInterval(refresh, 30_000);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, [studentId]);

  const unread = decisions.filter((decision) => !read.has(decisionKey(decision))).length;

  function markRead(items) {
    const next = new Set([...read, ...items.map(decisionKey)]);
    setRead(next);
    try {
      localStorage.setItem(storageKey, JSON.stringify([...next]));
    } catch {
      // The current session can still mark decisions as read.
    }
  }

  return (
    <div className="relative" onKeyDown={(event) => {
      if (event.key === "Escape" && open) {
        setOpen(false);
        event.currentTarget.querySelector("button").focus();
      }
    }}>
      <button type="button" onClick={() => setOpen(!open)} aria-expanded={open}
        aria-controls="student-notifications" aria-label={`Notifications, ${unread} unread`}
        className="relative grid size-11 place-items-center rounded-xl border border-zinc-800 text-zinc-300 hover:bg-zinc-800 focus-visible:ring-2 focus-visible:ring-indigo-300">
        <Bell size={20} aria-hidden="true" />
        {unread > 0 && <span aria-hidden="true" className="absolute -right-1 -top-1 rounded-full bg-indigo-500 px-1.5 text-xs font-semibold text-white">{unread}</span>}
      </button>
      <section id="student-notifications" hidden={!open} aria-label="Application notifications"
        className="absolute -right-12 z-30 mt-3 w-[min(20rem,calc(100vw-2rem))] rounded-2xl border border-zinc-700 bg-zinc-900 p-4 shadow-xl sm:right-0">
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-semibold">Notifications</h2>
          {unread > 0 && <button type="button" onClick={() => markRead(decisions)} className="text-xs text-indigo-300 hover:underline">Mark all as read</button>}
        </div>
        {error && <p role="status" className="mt-3 text-sm text-zinc-400">Couldn’t refresh notifications. Retrying shortly.</p>}
        {!error && decisions.length === 0 && <p className="mt-3 text-sm text-zinc-400">{loaded ? "No application decisions yet." : "Loading notifications…"}</p>}
        <ul className="mt-2 max-h-80 overflow-y-auto">
          {decisions.map((decision) => (
            <li key={decisionKey(decision)} className="border-t border-zinc-800">
              <Link to="/student/applications" onClick={() => { markRead([decision]); setOpen(false); }}
                className="block rounded-lg p-2 hover:bg-zinc-800">
                <span className="block text-sm font-medium">{!read.has(decisionKey(decision)) && <span className="mr-2 text-indigo-400" aria-label="Unread">●</span>}{decision.project?.title || "Project application"}</span>
                <span className={`text-xs ${decision.status === "Accepted" ? "text-emerald-300" : "text-rose-300"}`}>Application {decision.status.toLowerCase()}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
