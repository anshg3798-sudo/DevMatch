const AuthCard = ({ children }) => {
  return (
    <div className="w-full rounded-3xl border border-zinc-800 bg-zinc-900/80 p-8 shadow-2xl backdrop-blur-xl">
      {children}
    </div>
  );
};

export default AuthCard;