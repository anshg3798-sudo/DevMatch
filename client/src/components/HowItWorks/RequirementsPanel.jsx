import { requiredSkills, matchingWeights } from "./requirementsData";
import { CheckCircle2 } from "lucide-react";

const RequirementsPanel = () => {
  return (
    <div
      className="
        group
        fade-up
        h-full
        rounded-3xl
        border
        border-zinc-800
        bg-zinc-950
        p-6
        shadow-lg
        transition-all
        duration-500
        hover:-translate-y-2
        hover:border-indigo-500/30
        hover:shadow-[0_0_40px_rgba(99,102,241,0.18)]
      "
    >
      <h3 className="text-2xl font-bold text-white">
        Project Requirements
      </h3>

      <div className="mt-7 space-y-3">
        {requiredSkills.map((skill) => (
          <div
            key={skill}
            className="
              flex
              items-center
              justify-between
              rounded-xl
              border
              border-zinc-800
              bg-zinc-950
              px-4
              py-3
              transition-all
              duration-300
              hover:border-indigo-500/30
              hover:bg-zinc-900
            "
          >
            <span className="font-medium text-zinc-200">
              {skill}
            </span>

            <CheckCircle2
              size={20}
              className="text-emerald-400"
            />
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h4 className="mb-5 text-sm font-semibold uppercase tracking-widest text-zinc-500">
          Matching Priority
        </h4>

        <div className="space-y-5">
          {matchingWeights.map((item) => (
            <div key={item.label}>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm text-zinc-400">
                  {item.label}
                </span>

                <span className="text-sm font-semibold text-white">
                  {item.value}%
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
                <div
                  className="
                    h-full
                    rounded-full
                    bg-gradient-to-r
                    from-indigo-500
                    to-violet-400
                    transition-all
                    duration-700
                  "
                  style={{
                    width: `${item.value}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RequirementsPanel;