import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import BackedForScale from "@/sections/BackedForScale";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <BackedForScale />
      <main className="flex-1" />
    </>
  );
}
