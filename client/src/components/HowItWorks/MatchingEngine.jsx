import {
  BrainCircuit,
  Calculator,
  FileSearch,
  Sparkles,
} from "lucide-react";

const steps = [
  {
    icon: Calculator,
    text: "Calculate weighted compatibility",
  },
  {
    icon: FileSearch,
    text: "Analyze project portfolio",
  },
  {
    icon: BrainCircuit,
    text: "Evaluate overall fit",
  },
  {
    icon: Sparkles,
    text: "Generate AI explanation",
  },
];

const MatchingEngine = () => {
  return (
    <div className="rounded-2xl border border-indigo-500/20 bg-gradient-to-b from-indigo-500/10 to-zinc-950 p-8">
      <div className="mb-8 flex items-center gap-3">
        <div className="rounded-xl bg-indigo-500/20 p-3">
          <BrainCircuit className="text-indigo-400" />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white">
            AI Matching Engine
          </h3>

          <p className="text-sm text-zinc-400">
            Smart compatibility analysis
          </p>
        </div>
      </div>

      <div className="space-y-5">
        {steps.map(({ icon: Icon, text }) => (
          <div
            key={text}
            className="flex items-center gap-4"
          >
            <Icon
              size={18}
              className="text-indigo-400"
            />

            <span className="text-zinc-300">
              {text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MatchingEngine;