import CandidateCard from "./CandidateCard";

function HeroDashboard() {
  const candidates = [
    {
      rank: "🥇",
      name: "Alex Johnson",
      match: 95,
      experience: "2 Years",
      availability: "Available Now",
      skills: ["React", "Node", "MongoDB"],
    },
    {
      rank: "🥈",
      name: "Sarah Lee",
      match: 92,
      experience: "3 Years",
      availability: "20 hrs/week",
      skills: ["React", "Express", "AWS"],
    },
    {
      rank: "🥉",
      name: "David Kim",
      match: 90,
      experience: "1.5 Years",
      availability: "Weekend",
      skills: ["Next.js", "MongoDB", "TypeScript"],
    },
  ];

  return (
    <div className="flex flex-1 justify-center">

      <div className="w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl backdrop-blur-xl">

        {/* Header */}

        <div className="flex items-center justify-between">

          <div>

            <p className="text-sm text-violet-400">
              AI Match Preview
            </p>

            <h2 className="mt-1 text-2xl font-bold">
              Project Analysis
            </h2>

          </div>

          <div className="rounded-full bg-emerald-500/20 px-3 py-1 text-sm font-medium text-emerald-400">

            ● Live

          </div>

        </div>

        {/* Project */}

        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-950 p-5">

          <p className="text-sm text-slate-400">

            Project

          </p>

          <h3 className="mt-2 text-xl font-semibold">

            AI Resume Analyzer

          </h3>

          <div className="mt-4 flex flex-wrap gap-2">

            {["React", "Node.js", "MongoDB", "Express"].map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-violet-500/10 px-3 py-1 text-sm text-violet-300"
              >
                {skill}
              </span>
            ))}

          </div>

        </div>

        {/* Candidate List */}

        <div className="mt-8">

          <div className="mb-5 flex items-center justify-between">

            <h3 className="text-lg font-semibold">

              Top AI Matches

            </h3>

            <span className="text-sm text-slate-400">

              Ranked Automatically

            </span>

          </div>

          <div className="space-y-5">

            {candidates.map((candidate) => (
              <CandidateCard
                key={candidate.name}
                rank={candidate.rank}
                name={candidate.name}
                match={candidate.match}
                experience={candidate.experience}
                availability={candidate.availability}
                skills={candidate.skills}
              />
            ))}

          </div>

        </div>

        {/* AI Insights */}

        <div className="mt-8 rounded-2xl border border-violet-500/20 bg-violet-500/5 p-5">

          <h3 className="font-semibold">

            🤖 AI Insights

          </h3>

          <div className="mt-4 space-y-3 text-sm text-slate-300">

            <p>

              ✓ Strong React skill alignment

            </p>

            <p>

              ✓ High availability across candidates

            </p>

            <p>

              ✓ Previous experience on similar projects

            </p>

            <p>

              ✓ Communication score above 9/10

            </p>

          </div>

        </div>

        {/* Footer */}

        <button className="mt-8 w-full rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 py-4 text-lg font-semibold transition duration-300 hover:scale-[1.02]">

          View Full Analysis →

        </button>

      </div>

    </div>
  );
}

export default HeroDashboard;