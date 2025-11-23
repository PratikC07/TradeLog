import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardPreview } from "./DashboardPreview";

export const Hero: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative pt-32 pb-16 px-6 md:pt-48 md:pb-32 overflow-hidden">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        {/* Hero Text */}
        <div
          className={`space-y-8 transition-all duration-1000 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          } relative z-20`}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-neon-green mb-4">
            <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse"></span>
            v2.5 Now Available
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[0.95] sm:leading-[0.9]">
            Trading.
            <br />
            <span className="text-gradient">Evolved.</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-md leading-relaxed">
            The secret weapon for the next generation of whales. Professional
            logging, AI analytics, and bank-grade execution tracking.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              onClick={() => navigate("/auth/register")}
              className="px-8 py-4 bg-neon-green hover:bg-[#b3e600] text-black font-bold rounded-full text-lg transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(204,255,0,0.4)] flex items-center justify-center gap-2 group"
            >
              Start Logging
              <span className="group-hover:translate-x-1 transition-transform">
                →
              </span>
            </button>
          </div>

          <div className="flex items-center gap-4 pt-4 text-sm text-gray-500">
            <div className="flex -space-x-3">
              <img
                src="https://i.pravatar.cc/100?img=33"
                alt="User 1"
                className="w-10 h-10 rounded-full border-2 border-black object-cover"
              />
              <img
                src="https://i.pravatar.cc/100?img=47"
                alt="User 2"
                className="w-10 h-10 rounded-full border-2 border-black object-cover"
              />
              <img
                src="https://i.pravatar.cc/100?img=12"
                alt="User 3"
                className="w-10 h-10 rounded-full border-2 border-black object-cover"
              />
            </div>
            <p>Trusted by 10,000+ traders</p>
          </div>
        </div>

        {/* Hero Visual - 3D Floating Dashboard */}
        <div
          className={`relative perspective-1000 transition-all duration-1000 delay-300 ${
            mounted ? "opacity-100 translate-x-0" : "opacity-0 translate-x-20"
          } flex justify-center md:justify-end`}
        >
          {/* Glowing Backdrop */}
          <div className="absolute inset-0 bg-gradient-to-tr from-neon-green/20 to-neon-blue/20 blur-[60px] md:blur-[80px] rounded-full transform scale-75 animate-pulse pointer-events-none" />

          {/* Container */}
          <div className="relative w-full max-w-[500px] lg:max-w-full py-12 px-2 md:p-0 animate-float transform md:rotate-y-[-12deg] md:rotate-x-[5deg] hover:rotate-0 transition-transform duration-700 ease-out">
            <DashboardPreview />
          </div>
        </div>
      </div>
    </div>
  );
};
