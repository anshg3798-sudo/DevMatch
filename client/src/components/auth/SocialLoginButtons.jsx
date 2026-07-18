const SocialLoginButtons = () => {
  return (
    <>
      <div className="my-6 flex items-center">
        <div className="h-px flex-1 bg-zinc-800" />
        <span className="mx-4 text-sm text-zinc-500">OR</span>
        <div className="h-px flex-1 bg-zinc-800" />
      </div>

      <div className="space-y-3">
        <button className="w-full rounded-xl border border-zinc-700 bg-zinc-900 py-3 font-medium text-white transition hover:border-indigo-500">
          Continue with Google
        </button>

        <button className="w-full rounded-xl border border-zinc-700 bg-zinc-900 py-3 font-medium text-white transition hover:border-indigo-500">
          Continue with GitHub
        </button>
      </div>
    </>
  );
};

export default SocialLoginButtons;