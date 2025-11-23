import React from "react";

interface LogoProps {
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className = "w-8 h-8" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`${className} transform transition-transform duration-500 ease-out group-hover:rotate-12 group-hover:scale-110`}
  >
    {/* Bottom Layer */}
    <path
      d="M12 21L2 16L12 11L22 16L12 21Z"
      className="fill-neon-green/10 stroke-neon-green stroke-[1.5] transition-all duration-500 group-hover:fill-neon-green/30"
    />
    {/* Middle Layer */}
    <path
      d="M12 16L2 11L12 6L22 11L12 16Z"
      className="fill-neon-green/30 stroke-neon-green stroke-[1.5] transition-all duration-500 group-hover:-translate-y-1.5 group-hover:fill-neon-green/50"
    />
    {/* Top Layer */}
    <path
      d="M12 11L2 6L12 1L22 6L12 11Z"
      className="fill-neon-green stroke-neon-green stroke-[1.5] transition-all duration-500 group-hover:-translate-y-3 group-hover:drop-shadow-[0_0_10px_rgba(204,255,0,0.5)]"
    />
  </svg>
);
