import { Link } from "react-router-dom";
import AuthLayout from "../components/auth/AuthLayout";

const Signup = () => {
  return (
    <AuthLayout>
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-8">
        <h1 className="text-3xl font-bold text-white">
          Create Account
        </h1>

        <p className="mt-2 text-zinc-400">
          Start finding your perfect development team.
        </p>

        <form className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block text-sm text-zinc-300">
              Full Name
            </label>

            <input
              type="text"
              placeholder="John Doe"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 p-3 text-white outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-zinc-300">
              Email
            </label>

            <input
              type="email"
              placeholder="john@gmail.com"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 p-3 text-white outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-zinc-300">
              Password
            </label>

            <input
              type="password"
              placeholder="********"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 p-3 text-white outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-zinc-300">
              Role
            </label>

            <select
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 p-3 text-white outline-none focus:border-indigo-500"
            >
              <option>Recruiter</option>
              <option>Student</option>
            </select>
          </div>

          <button
            className="w-full rounded-lg bg-indigo-600 py-3 font-semibold text-white hover:bg-indigo-500"
          >
            Create Account
          </button>
        </form>

        <p className="mt-6 text-center text-zinc-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-indigo-400 hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Signup;