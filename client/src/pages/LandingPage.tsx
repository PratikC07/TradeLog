import React from "react";
import { Navbar } from "../features/landing/components/Navbar";
import { Hero } from "../features/landing/components/Hero";
import { Features } from "../features/landing/components/Features";
import { Reviews } from "../features/landing/components/Reviews";
import { Footer } from "../features/landing/components/Footer";
import { Ticker } from "../components/ui/Ticker";

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-dark-bg flex flex-col relative overflow-x-hidden selection:bg-neon-green/20 selection:text-neon-green font-sans">
      {/* Global Background Effects */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-neon-green/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-neon-blue/5 rounded-full blur-[120px] pointer-events-none" />

      <Navbar />

      <main className="flex-1 flex flex-col">
        <Hero />
        {/* Ticker placed between Hero and Features */}
        <div className="mb-0">
          <Ticker />
        </div>

        <Features />
        <Reviews />
        <Footer />
      </main>
    </div>
  );
};

export default LandingPage;
