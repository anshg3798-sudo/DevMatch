const AuthLayout = ({ children }) => {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-zinc-950 px-6">
      {/* Background Glow */}
      <div className="absolute inset-0">
        <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-indigo-600/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-violet-600/10 blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex w-full max-w-md flex-col items-center">
        {/* Logo */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white">
            Dev<span className="text-indigo-400">Match</span>
          </h1>

          <p className="mt-3 text-sm text-zinc-400">
            Build smarter developer teams with AI.
          </p>
        </div>

        {children}

        <p className="mt-8 text-sm text-zinc-500">
          © 2026 DevMatch. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default AuthLayout;