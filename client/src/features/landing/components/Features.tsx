import React from "react";
import { ResponsiveContainer, BarChart, Bar } from "recharts";
import { LineChart, Shield, Moon } from "../../../components/ui/Icons";
import { FeatureCard } from "../../../components/ui/FeatureCard";

const mockChartData = Array.from({ length: 20 }, (_, i) => ({
  name: i,
  uv: Math.random() * 100 + 20,
  pv: Math.random() * 100 - 20,
}));

export const Features: React.FC = () => {
  return (
    <div
      id="features"
      className="bg-black/50 py-20 md:py-32 px-6 border-t border-white/5 scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 md:mb-24">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            <span className="text-gradient">Pro-Grade Tools</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Everything you need to analyze, execute, and improve your trading
            strategy in one unified platform.
          </p>
        </div>

        <div className="grid gap-4 md:gap-6 lg:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            title="Institutional Analytics"
            description="Deep-dive into your performance with granular data and powerful visualizations."
            icon={
              <LineChart className="text-neon-green w-5 h-5 md:w-6 md:h-6" />
            }
            glowColor="green"
          >
            <div className="absolute inset-0 flex items-end px-2">
              <ResponsiveContainer width="100%" height="80%">
                <BarChart data={mockChartData}>
                  <Bar dataKey="uv" fill="#ccff00" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="pv" fill="#222" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </FeatureCard>

          <FeatureCard
            title="Bank-Grade Security"
            description="Your data is encrypted end-to-end. Always safe, always private."
            icon={<Shield className="text-neon-blue w-5 h-5 md:w-6 md:h-6" />}
            glowColor="blue"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <Shield
                size={56}
                className="text-neon-blue/20 absolute animate-pulse"
              />
              <Shield
                size={40}
                className="text-neon-blue relative z-10 drop-shadow-[0_0_15px_rgba(0,229,255,0.5)]"
              />
            </div>
          </FeatureCard>

          <FeatureCard
            title="Dark Mode Native"
            description="Designed for focus, day or night. Easier on the eyes for long sessions."
            icon={<Moon className="text-neon-purple w-5 h-5 md:w-6 md:h-6" />}
            glowColor="purple"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gray-800 to-black border border-white/10 flex items-center justify-center shadow-[inset_0_2px_10px_rgba(255,255,255,0.1)]">
                <Moon className="text-white/90 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
              </div>
            </div>
          </FeatureCard>
        </div>
      </div>
    </div>
  );
};
