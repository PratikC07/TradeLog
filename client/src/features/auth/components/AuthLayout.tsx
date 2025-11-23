import React, { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Logo } from "../../../components/ui/Logo";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
}) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-dark-bg flex flex-col relative font-sans selection:bg-neon-green/20 selection:text-neon-green overflow-x-hidden overflow-y-auto">
      {/* Background Effects - Preserved from original */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-neon-green/5 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-neon-blue/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Left Brand Navigation */}
      <div
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 md:top-8 md:left-8 z-50 flex items-center gap-3 cursor-pointer group select-none"
      >
        <div className="relative">
          <Logo />
        </div>
        <span className="font-bold text-lg md:text-xl text-white tracking-tighter transition-all duration-300 group-hover:text-neon-green group-hover:tracking-wide group-hover:drop-shadow-[0_0_8px_rgba(204,255,0,0.3)]">
          TradeLog
        </span>
      </div>

      {/* Main Content Container */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 relative z-10">
        <div className="w-full max-w-[440px] my-12 md:my-0">
          {/* Card */}
          <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl md:rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl relative overflow-hidden backdrop-blur-sm group">
            {/* Full width top gradient highlight */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-neon-green to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>

            {/* Heading */}
            <div className="mb-8 md:mb-10 text-center">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight mb-2 md:mb-3">
                {title}
              </h1>
              <p className="text-gray-400 text-sm md:text-base">{subtitle}</p>
            </div>

            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
