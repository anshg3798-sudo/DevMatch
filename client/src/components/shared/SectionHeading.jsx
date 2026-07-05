const SectionHeading = ({ badge, title, description }) => {
  return (
    <div className="mx-auto mb-16 max-w-4xl text-center">
      <span className="inline-flex rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-1 text-sm font-medium text-violet-400">
        {badge}
      </span>

      <h2 className="mt-6 text-4xl font-bold tracking-tight text-white md:text-5xl">
        {title}
      </h2>

      <p className="mt-6 text-lg leading-8 text-zinc-400">
        {description}
      </p>
    </div>
  );
};

export default SectionHeading;