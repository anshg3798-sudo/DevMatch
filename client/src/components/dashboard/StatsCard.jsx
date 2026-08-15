import { ArrowUpRight } from "lucide-react";

const StatsCard = ({
  title,
  value,
  description,
  icon: Icon,
}) => {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 transition hover:border-zinc-700">
      <div className="flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
          <Icon size={20} />
        </div>

        <ArrowUpRight
          size={18}
          className="text-zinc-600"
        />
      </div>

      <div className="mt-5">
        <p className="text-sm text-zinc-400">
          {title}
        </p>

        <h3 className="mt-1 text-3xl font-bold text-white">
          {value}
        </h3>

        <p className="mt-2 text-xs text-zinc-500">
          {description}
        </p>
      </div>
    </div>
  );
};

export default StatsCard;