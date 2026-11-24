import Navbar from "../components/Navbar/Navbar.jsx";
import Hero from "../components/Hero/Hero.jsx";
import Features from  "../components/Features/Features.jsx";
import HowItWorks from "../components/HowItWorks/HowItWorks.jsx";
function LandingPage() {
  return (
    <>
      <Navbar />
      <Hero />
      <section id="about" aria-label="About DevMatch" className="scroll-mt-20">
        <Features />
        <HowItWorks />
      </section>
    </>
  );
}

export default LandingPage;
