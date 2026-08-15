import { Menu } from "lucide-react";
import { Link } from "react-router-dom";
const navLinks = [
  {
    name: "Explore Projects",
    href: "#",
  },
  {
    name: "Discover Talent",
    href: "#",
  },
  {
    name: "About",
    href: "#",
  },
];

function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        {/* Left Section */}
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-xl font-bold text-white">
            D
          </div>

          <h1 className="text-2xl font-bold tracking-wide text-white">
            DevMatch
          </h1>
        </div>

        {/* Center Section */}
        <div className="hidden items-center gap-10 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-slate-300 transition hover:text-blue-400"
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Right Section */}
        <div className="hidden items-center gap-4 md:flex">
          <Link 
          to="/login"
          className="rounded-lg px-5 py-2 font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
            >
            Login
          </Link>

          <Link 
          to="/signup"
          className="rounded-xl bg-blue-600 px-5 py-2 font-semibold text-white transition hover:bg-blue-700">
            Sign Up
          </Link>
        </div>

        {/* Mobile Menu Icon */}
        <button className="text-white md:hidden">
          <Menu size={28} />
        </button>
      </div>
    </nav>
  );
}

export default Navbar;