import React from "react";
import { AreaChart, Area, ResponsiveContainer, YAxis } from "recharts";
import { Activity, Shield, Zap } from "../../../components/ui/Icons";

const data = [
  { v: 4000 },
  { v: 3000 },
  { v: 2000 },
  { v: 2780 },
  { v: 1890 },
  { v: 2390 },
  { v: 3490 },
  { v: 4000 },
  { v: 3000 },
  { v: 4500 },
  { v: 5000 },
  { v: 4800 },
  { v: 5200 },
  { v: 6100 },
];

export const DashboardPreview: React.FC = () => {
  return (
    <div className="relative w-full max-w-[800px] aspect-[16/10] bg-dark-card rounded-xl border border-white/10 overflow-visible shadow-[0_0_80px_-20px_rgba(204,255,0,0.2)] group transform transition-transform duration-500 hover:scale-[1.01]">
      {/* Top Bar */}
      <div className="h-8 md:h-12 border-b border-white/5 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-red-500/50"></div>
          <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-yellow-500/50"></div>
          <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-green-500/50"></div>
        </div>
        <div className="text-[10px] md:text-xs text-gray-500 font-mono">
          DASHBOARD v2.4.1
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="flex h-[calc(100%-2rem)] md:h-[calc(100%-3rem)]">
        {/* Sidebar */}
        <div className="w-12 md:w-16 border-r border-white/5 flex flex-col items-center py-4 gap-4 md:gap-6">
          <div className="w-6 h-6 md:w-8 md:h-8 rounded bg-white/5 flex items-center justify-center text-neon-green">
            <Activity size={14} className="md:w-4 md:h-4" />
          </div>
          <div className="w-6 h-6 md:w-8 md:h-8 rounded bg-transparent flex items-center justify-center text-gray-600">
            <Shield size={14} className="md:w-4 md:h-4" />
          </div>
          <div className="w-6 h-6 md:w-8 md:h-8 rounded bg-transparent flex items-center justify-center text-gray-600">
            <Zap size={14} className="md:w-4 md:h-4" />
          </div>
        </div>

        {/* Charts Area */}
        <div className="flex-1 p-4 md:p-6 flex flex-col gap-3 md:gap-4">
          <div className="flex justify-between items-end">
            <div>
              <h3 className="text-gray-400 text-[10px] md:text-xs uppercase tracking-wider">
                Total Balance
              </h3>
              <div className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
                $532,222.67
                <span className="text-xs md:text-sm text-neon-green bg-neon-green/10 px-2 py-0.5 rounded">
                  +4.2%
                </span>
              </div>
            </div>
            <div className="text-right hidden sm:block">
              <h3 className="text-gray-400 text-[10px] md:text-xs uppercase tracking-wider">
                Current Drawdown
              </h3>
              <div className="text-lg md:text-xl font-bold text-white">
                0.8%
              </div>
            </div>
          </div>

          {/* Main Chart Visual */}
          <div className="flex-1 bg-black/20 rounded-lg border border-white/5 relative overflow-hidden p-2 md:p-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorV" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ccff00" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ccff00" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <YAxis hide domain={["dataMin", "dataMax"]} />
                <Area
                  type="monotone"
                  dataKey="v"
                  stroke="#ccff00"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorV)"
                />
              </AreaChart>
            </ResponsiveContainer>

            {/* Floating Badges inside chart - hidden on super small screens if needed */}
            <div className="absolute top-4 right-4 bg-dark-card/80 backdrop-blur border border-white/10 px-3 py-2 rounded-lg hidden sm:block">
              <div className="text-[10px] md:text-xs text-gray-400">
                Target Reached
              </div>
              <div className="text-neon-green font-mono text-xs md:text-sm">
                $64,200
              </div>
            </div>
          </div>

          {/* Bottom Stats Row */}
          <div className="h-16 md:h-24 grid grid-cols-3 gap-2 md:gap-4">
            <div className="bg-white/5 rounded-lg p-2 md:p-3">
              <div className="w-6 h-1 md:w-8 bg-blue-500 rounded-full mb-1 md:mb-2"></div>
              <div className="text-[10px] md:text-xs text-gray-500">
                Win Rate
              </div>
              <div className="text-sm md:text-lg font-bold">68%</div>
            </div>
            <div className="bg-white/5 rounded-lg p-2 md:p-3">
              <div className="w-6 h-1 md:w-8 bg-purple-500 rounded-full mb-1 md:mb-2"></div>
              <div className="text-[10px] md:text-xs text-gray-500">
                Profit Factor
              </div>
              <div className="text-sm md:text-lg font-bold">2.4</div>
            </div>
            <div className="bg-neon-green rounded-lg p-2 md:p-3 flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity">
              <span className="text-black font-bold text-xs md:text-sm text-center">
                Chart Trade
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Reflection effect */}
      <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none rounded-xl" />

      {/* Floating Elements - Responsive Positioning */}
      {/* Right Card: Overlaps top edge on mobile, floats outside right on desktop */}
      <div
        className="absolute right-4 -top-6 md:-right-6 md:top-20 bg-dark-card border border-white/10 p-2 md:p-4 rounded-xl shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] animate-float z-30 min-w-[100px] md:min-w-[140px]"
        style={{ animationDelay: "1s" }}
      >
        <div className="text-[9px] md:text-xs text-gray-400 mb-0.5 md:mb-1">
          BTC/USD Long
        </div>
        <div className="text-xs md:text-base text-neon-green font-bold">
          + $2,450
        </div>
      </div>

      {/* Left Card: Overlaps bottom edge on mobile, floats outside left on desktop */}
      <div
        className="absolute left-4 -bottom-6 md:-left-4 md:bottom-28 bg-dark-card border border-white/10 p-2 md:p-4 rounded-xl shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] animate-float z-30 min-w-[100px] md:min-w-[140px]"
        style={{ animationDelay: "2s" }}
      >
        <div className="text-[9px] md:text-xs text-gray-400 mb-0.5 md:mb-1">
          Win Streak
        </div>
        <div className="text-xs md:text-base text-neon-green font-bold">
          8 Trades
        </div>
      </div>
    </div>
  );
};
