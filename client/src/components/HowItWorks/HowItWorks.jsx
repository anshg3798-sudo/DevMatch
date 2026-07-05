import SectionHeading from "../Shared/SectionHeading";
import RequirementsPanel from "./RequirementsPanel";
import MatchingEngine from "./MatchingEngine";
import CandidateResults from "./CandidateResults";

const HowItWorks = () => {
  return (
    <section className="border-t border-zinc-900 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          badge="How It Works"
          title="How DevMatch Matches Developers"
          description="A transparent and customizable matching process designed to build stronger software teams."
        />

        <div className="mt-12 grid items-center gap-8 lg:grid-cols-3">
          <RequirementsPanel />
          <MatchingEngine />
          <CandidateResults />
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;