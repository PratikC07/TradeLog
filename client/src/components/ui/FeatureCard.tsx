import React, { ReactNode } from 'react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  children?: ReactNode;
  glowColor?: 'green' | 'blue' | 'purple';
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon, children, glowColor = 'green' }) => {
  const glowClass = {
    green: 'group-hover:shadow-[0_0_40px_-10px_rgba(204,255,0,0.3)] border-neon-green/20',
    blue: 'group-hover:shadow-[0_0_40px_-10px_rgba(0,229,255,0.3)] border-neon-blue/20',
    purple: 'group-hover:shadow-[0_0_40px_-10px_rgba(170,0,255,0.3)] border-neon-purple/20',
  }[glowColor];

  return (
    <div className={`group relative bg-dark-card border border-white/10 rounded-2xl p-1 transition-all duration-300 hover:-translate-y-1 ${glowClass} h-full`}>
       <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none"></div>
       
       <div className="bg-black/40 h-full rounded-xl p-5 md:p-6 flex flex-col justify-between overflow-hidden relative z-10">
          <div className="flex justify-between items-start mb-6">
            <div className="pr-4">
                <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
            </div>
            <div className="p-3 rounded-lg bg-white/5 border border-white/5 text-white shrink-0">
                {icon}
            </div>
          </div>
          
          {/* Preview Area - Compact Height */}
          <div className="relative w-full h-40 md:h-48 rounded-lg bg-white/5 border border-white/5 overflow-hidden mt-auto">
             {children}
          </div>
       </div>
    </div>
  );
};