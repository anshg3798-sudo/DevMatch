import SectionHeading from "../shared/SectionHeading";
import FeatureGrid from "./FeatureGrid";

const Features = () => {
  return (
    <section
      id="features"
      className="bg-black py-24 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeading
  badge="Features"
  title="Everything You Need to Build the Perfect Team"
  description="DevMatch combines intelligent matching, customizable priorities, and explainable AI to help students build stronger software teams for every project."
/>
        <FeatureGrid />
      </div>
    </section>
  );
};

export default Features;