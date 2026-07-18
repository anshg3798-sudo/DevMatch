import { Link } from "react-router-dom";

const AuthFooter = () => {
  return (
    <p className="mt-8 text-center text-sm text-zinc-400">
      Don't have an account?{" "}
      <Link
        to="/signup"
        className="font-medium text-indigo-400 hover:text-indigo-300"
      >
        Create one
      </Link>
    </p>
  );
};

export default AuthFooter;