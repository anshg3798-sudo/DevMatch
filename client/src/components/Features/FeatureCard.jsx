const FeatureCard = ({ icon: Icon, title, description }) => {
  return (
    <div
      className="
        group
        flex
        h-full
        flex-col
        rounded-2xl
        border
        border-zinc-800
        bg-zinc-900/60
        p-10
        transition-all
        duration-300
        hover:-translate-y-2
        hover:border-violet-500/40
        hover:shadow-xl
        hover:shadow-violet-500/10
      "
    >
      <div
        className="
          mb-6
          flex
          h-14
          w-14
          items-center
          justify-center
          rounded-xl
          bg-violet-500/10
          transition-all
          duration-300
          group-hover:scale-105
          group-hover:bg-violet-500/20
        "
      >
        <Icon className="h-7 w-7 text-violet-400" />
      </div>

      <h3 className="text-xl font-semibold text-white">
        {title}
      </h3>

      <p className="mt-4 flex-grow leading-8 text-zinc-400">
        {description}
      </p>
    </div>
  );
};

export default FeatureCard;