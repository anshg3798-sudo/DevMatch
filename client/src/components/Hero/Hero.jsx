import HeroContent from "./HeroContent";
import HeroDashboard from "./HeroDashboard";

function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-slate-950 text-white">

      {/* Background Blur - Top */}
      <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-violet-600/20 blur-3xl" />

      {/* Background Blur - Bottom */}
      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl" />

      {/* Main Container */}
      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-between gap-20 px-6 pt-12 pb-20 lg:flex-row lg:px-8">

        {/* Left Side */}
        <HeroContent />

        {/* Right Side */}
        <HeroDashboard />

      </div>

    </section>
  );
}

export default Hero;