function CandidateCard({
  rank,
  name,
  match,
  experience,
  availability,
  skills,
}) {
  return (
    <div className="group cursor-pointer rounded-2xl border border-slate-800 bg-slate-900/80 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/50 hover:bg-slate-900 hover:shadow-xl hover:shadow-violet-500/10">

      {/* Top Row */}

      <div className="flex items-start justify-between">

        <div className="flex items-center gap-4">

          {/* Avatar */}

          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-cyan-400 text-lg font-bold text-white">

            {name.charAt(0)}

          </div>

          <div>

            <div className="flex items-center gap-2">

              <span className="text-lg font-semibold">

                {name}

              </span>

              <span className="text-lg">

                {rank}

              </span>

            </div>

            <p className="text-sm text-slate-400">

              Full Stack Developer

            </p>

          </div>

        </div>

        {/* Match Percentage */}

        <div className="text-right">

          <h3 className="text-2xl font-bold text-emerald-400">

            {match}%

          </h3>

          <p className="text-xs text-slate-500">

            Match

          </p>

        </div>

      </div>

      {/* Progress */}

      <div className="mt-5">

        <div className="h-2 overflow-hidden rounded-full bg-slate-800">

          <div
            className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400"
            style={{ width: `${match}%` }}
          ></div>

        </div>

      </div>

      {/* Info */}

      <div className="mt-5 grid grid-cols-2 gap-4 text-sm">

        <div>

          <p className="text-slate-500">

            Experience

          </p>

          <p className="mt-1 font-medium">

            {experience}

          </p>

        </div>

        <div>

          <p className="text-slate-500">

            Availability

          </p>

          <p className="mt-1 font-medium text-emerald-400">

            {availability}

          </p>

        </div>

      </div>

      {/* Skills */}

      <div className="mt-5 flex flex-wrap gap-2">

        {skills.map((skill) => (
          <span
            key={skill}
            className="rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-xs text-violet-300"
          >
            {skill}
          </span>
        ))}

      </div>

      {/* Footer */}

      <div className="mt-6 flex items-center justify-between border-t border-slate-800 pt-4">

        <p className="text-sm text-slate-400">

          AI Recommendation

        </p>

        <button className="font-medium text-cyan-400 transition group-hover:text-cyan-300">

          View Details →

        </button>

      </div>

    </div>
  );
}

export default CandidateCard;