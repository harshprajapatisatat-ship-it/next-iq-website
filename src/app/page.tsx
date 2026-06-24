import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import SocialProof from "@/sections/SocialProof";
import BackedForScale from "@/sections/BackedForScale";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <SocialProof />
      {/* <BackedForScale /> */}
      <main className="flex-1" />
    </>
  );
}
