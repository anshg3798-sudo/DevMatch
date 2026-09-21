import {
  LayoutDashboard,
  Search,
  FileText,
  User,
  LogOut,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const StudentSidebar = () => {
  const navigate = useNavigate();

  const { logout } = useAuth();

  const menuItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      path: "/student/dashboard",
    },
    {
      title: "Browse Projects",
      icon: Search,
      path: "/student/projects",
    },
    {
      title: "My Applications",
      icon: FileText,
      path: "/student/applications",
    },
    {
      title: "Profile",
      icon: User,
      path: "/student/profile",
    },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-zinc-800 bg-zinc-950">
      {/* Logo */}

      <div className="border-b border-zinc-800 p-6">
        <h1 className="text-2xl font-bold text-white">
          Dev<span className="text-indigo-500">Match</span>
        </h1>

        <p className="mt-1 text-sm text-zinc-400">
          Student Panel
        </p>
      </div>

      {/* Navigation */}

      <nav className="flex-1 p-4">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.title}
              to={item.path}
              className={({ isActive }) =>
                `mb-2 flex items-center gap-3 rounded-xl px-4 py-3 transition-all ${
                  isActive
                    ? "bg-indigo-500/10 text-indigo-400"
                    : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                }`
              }
            >
              <Icon size={20} />

              <span>{item.title}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Logout */}

      <div className="border-t border-zinc-800 p-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-red-400 transition hover:bg-red-500/10"
        >
          <LogOut size={20} />

          Logout
        </button>
      </div>
    </aside>
  );
};

export default StudentSidebar;