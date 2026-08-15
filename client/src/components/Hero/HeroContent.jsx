function HeroContent() {
  return (
    <div className="max-w-3xl flex-1">

      {/* Badge */}

      <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-2 text-sm font-medium text-violet-300 backdrop-blur-sm">
        🚀 Intelligent Team Matching Platform
      </div>

      {/* Heading */}

      <h1 className="mt-6 text-6xl font-extrabold leading-tight tracking-tight lg:text-8xl">

        Find the Right
        <br />

        <span className="text-white">
          Teammates
        </span>

        <span className="block bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
          for Every Project.
        </span>

      </h1>

      {/* Description */}

      <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-400">

        Build stronger software teams with AI-powered teammate
        recommendations based on skills, availability,
        experience and project priorities.

        <br />
        <br />

        Every recommendation comes with a transparent explanation,
        helping project owners make confident decisions instead of
        relying on guesswork.

      </p>

      {/* Buttons */}

      <div className="mt-10 flex flex-wrap gap-4">

        <button className="rounded-xl bg-violet-600 px-8 py-4 font-semibold shadow-lg shadow-violet-600/30 transition duration-300 hover:-translate-y-1 hover:bg-violet-500">

          Start a Project

        </button>

        <button className="rounded-xl border border-slate-700 bg-slate-900 px-8 py-4 font-semibold transition duration-300 hover:border-violet-500 hover:bg-slate-800">

          See How Matching Works

        </button>

      </div>

      {/* Trust Pills */}

      <div className="mt-12 flex flex-wrap gap-3">

        <div className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-300">

          ✓ Adaptive Matching

        </div>

        <div className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-300">

          ✓ Explainable AI Rankings

        </div>

        <div className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-300">

          ✓ Built for Student Teams

        </div>

      </div>

      {/* Bottom Statistics */}

      <div className="mt-14 flex flex-wrap gap-10">

        <div>

          <h2 className="text-3xl font-bold text-white">
            500+
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Developers
          </p>

        </div>

        <div>

          <h2 className="text-3xl font-bold text-white">
            120+
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Student Projects
          </p>

        </div>

        <div>

          <h2 className="text-3xl font-bold text-white">
            95%
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Match Accuracy
          </p>

        </div>

      </div>

    </div>
  );
}

export default HeroContent;