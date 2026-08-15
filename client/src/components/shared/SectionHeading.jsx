const SectionHeading = ({ badge, title, description }) => {
  return (
    <div className="mx-auto mb-16 max-w-4xl text-center">
     <span className="inline-flex rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-1 text-sm font-medium text-indigo-600">
        {badge}
      </span>

      <h2 className="mt-6 text-4xl font-bold tracking-tight  text-zinc-600 md:text-5xl">
        {title}
      </h2>

      <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-zinc-600">
        {description}
      </p>
    </div>
  );
};

export default SectionHeading;