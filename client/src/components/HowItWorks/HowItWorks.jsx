import SectionHeading from "../shared/SectionHeading";
import RequirementsPanel from "./RequirementsPanel";
import MatchingEngine from "./MatchingEngine";
import CandidateResults from "./CandidateResults";
import FlowArrow from "./FlowArrow";

const HowItWorks = () => {
  return (
    <section className="border-t border-zinc-900 bg-zinc-50 py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-6">

        <SectionHeading
          badge="How It Works"
          title="How DevMatch Matches Developers"
          description="A transparent and customizable matching process designed to build stronger software teams."
        />

        <div
          className="
            mt-14
            grid
            items-center
            gap-8
            lg:grid-cols-[320px_70px_460px_70px_320px]
            lg:justify-center
          "
        >
          <RequirementsPanel />

          <FlowArrow />

          <MatchingEngine />

          <FlowArrow />

          <CandidateResults />
        </div>

      </div>
    </section>
  );
};

export default HowItWorks;