import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import SocialProof from "@/sections/SocialProof";
import HowItWorks from "@/sections/HowItWorks";
import CtaSection from "@/sections/CtaSection";
import WhySection from "@/sections/WhySection";
import FAQSection from "@/sections/FAQSection";
import Footer from "@/sections/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <SocialProof />
      <HowItWorks />
      <CtaSection />
      <WhySection />
      <FAQSection />
      <Footer />
    </>
  );
}
