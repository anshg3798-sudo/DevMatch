import { ArrowRight } from "lucide-react";

const FlowArrow = () => {
  return (
    <div className="hidden lg:flex items-center justify-center">
      <div className="group relative flex items-center justify-center">

        {/* Glow behind arrow */}
        <div className="absolute h-10 w-10 rounded-full bg-indigo-500/20 blur-xl group-hover:bg-indigo-500/30 transition-all duration-500" />

        <ArrowRight
          size={40}
          className="
            relative
            z-10
            float-animation
            text-indigo-500
            transition-all
            duration-300
            group-hover:translate-x-2
            group-hover:text-indigo-400
          "
        />

      </div>
    </div>
  );
};

export default FlowArrow;