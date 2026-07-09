import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import SocialProof from "@/sections/SocialProof";
import HowItWorks from "@/sections/HowItWorks";
import CtaSection from "@/sections/CtaSection";
import WhySection from "@/sections/WhySection";
import TestimonialsSection from "@/sections/TestimonialsSection";
import BookDemoSection from "@/sections/BookDemoSection";
import FAQSection from "@/sections/FAQSection";
import Footer from "@/sections/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <SocialProof />
      <HowItWorks />
      <TestimonialsSection />
      {/* <CtaSection /> */}
      {/* <WhySection /> */}
      <FAQSection />
      <BookDemoSection />
      <Footer />
    </>
  );
}
