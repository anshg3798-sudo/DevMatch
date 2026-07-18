import {
  BrainCircuit,
  Calculator,
  FileSearch,
  Sparkles,
  Activity,
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
    <div
      className="
      group
      relative
      glow-animation
      float-animation
      overflow-hidden
      rounded-3xl
      border
      border-indigo-500/20
      bg-gradient-to-br
      from-indigo-500/15
      via-zinc-900
      to-black
      p-8
      shadow-[0_0_40px_rgba(99,102,241,0.12)]
      transition-all
      duration-500
      hover:-translate-y-2
      hover:border-indigo-400/40
      hover:shadow-[0_0_60px_rgba(99,102,241,0.28)]
    "
    >
      {/* Glow */}
      <div className="absolute -top-20 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-indigo-500/20 blur-3xl" />

      <div className="relative z-10">

        <div className="mb-8 flex items-center justify-between">

          <div className="flex items-center gap-4">

            <div className="rounded-2xl bg-indigo-500/20 p-4">
              <BrainCircuit
                size={28}
                className="text-indigo-400"
              />
            </div>

            <div>
              <h3 className="text-2xl font-bold text-white">
                AI Matching Engine
              </h3>

              <p className="mt-1 text-zinc-400">
                Smart compatibility analysis
              </p>
            </div>

          </div>

          <div className="flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1">

            <Activity
              size={16}
              className="animate-pulse text-emerald-400"
            />

            <span className="text-sm font-medium text-emerald-400">
              Active
            </span>

          </div>

        </div>

        <div className="space-y-5">

          {steps.map(({ icon: Icon, text }, index) => (
            <div
              key={text}
              className="
              flex
              items-center
              gap-4
              rounded-xl
              border
              border-transparent
              p-3
              transition-all
              duration-300
              hover:border-indigo-500/20
              hover:bg-white/5
            "
            >

              <div className="rounded-lg bg-indigo-500/10 p-2">

                <Icon
                  size={20}
                  className="text-indigo-400"
                />

              </div>

              <span className="text-base text-zinc-200">
                {text}
              </span>

            </div>
          ))}

        </div>

      </div>
    </div>
  );
};

export default MatchingEngine;