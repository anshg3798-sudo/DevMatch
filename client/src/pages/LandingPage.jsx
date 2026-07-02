import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import WhyDevMatch from "../components/WhyDevMatch";
import HowItWorks from "../components/HowItWorks";
import Stats from "../components/Stats";
import CTA from "../components/CTA";
import Footer from "../components/Footer";

function LandingPage() {
  return (
    <>
      <Navbar />
      <Hero />
      <WhyDevMatch />
      <HowItWorks />
      <Stats />
      <CTA />
      <Footer />
    </>
  );
}

export default LandingPage;