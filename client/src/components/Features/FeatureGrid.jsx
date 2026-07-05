import FeatureCard from "./FeatureCard";
import { features } from "./featuresData";

const FeatureGrid = () => {
  return (
    <div
      className="
        grid
        items-stretch
        gap-8
        sm:grid-cols-2
        lg:grid-cols-3
      "
    >
      {features.map((feature) => (
        <FeatureCard
          key={feature.title}
          icon={feature.icon}
          title={feature.title}
          description={feature.description}
        />
      ))}
    </div>
  );
};

export default FeatureGrid;