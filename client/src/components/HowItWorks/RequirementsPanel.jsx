import { requiredSkills, matchingWeights } from "./requirementsData";
import { CheckCircle2 } from "lucide-react";

const RequirementsPanel = () => {
  return (
    <div className=" h-full rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
      <h3 className="text-lg font-semibold text-white">
        Project Requirements
      </h3>

      <div className="mt-6 space-y-3">
        {requiredSkills.map((skill) => (
          <div
            key={skill}
            className="flex items-center justify-between rounded-lg border border-zinc-800 px-4 py-3"
          >
            <span className="text-zinc-300">{skill}</span>

            <CheckCircle2
              size={18}
              className="text-emerald-400"
            />
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h4 className="mb-4 text-sm font-medium uppercase tracking-wide text-zinc-500">
          Matching Priority
        </h4>

        <div className="space-y-4">
          {matchingWeights.map((item) => (
            <div key={item.label}>
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-zinc-400">
                  {item.label}
                </span>

                <span className="text-white">
                  {item.value}%
                </span>
              </div>

              <div className="h-2 rounded-full bg-zinc-800">
                <div
                  className="h-full rounded-full bg-indigo-500"
                  style={{ width: `${item.value}%` }}
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