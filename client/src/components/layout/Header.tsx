import React, { useState, useRef, useEffect } from "react";
import { UserProfile } from "../../types/api";
import { User, Menu } from "../ui/Icons"; // Ensure Menu is imported

interface HeaderProps {
  user: UserProfile | null;
  title: string;
  onMenuToggle: () => void; // New Prop
}

export const Header: React.FC<HeaderProps> = ({
  user,
  title,
  onMenuToggle,
}) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getAvatarGradient = (name: string) => {
    if (!name) return "from-gray-700 to-gray-900";
    if (name.length % 2 === 0) return "from-neon-blue/80 to-purple-600";
    return "from-neon-green/80 to-emerald-600";
  };

  const getInitials = (name: string) => {
    if (!name) return "";
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <header className="h-20 border-b border-white/5 bg-black/50 backdrop-blur flex items-center justify-between px-4 md:px-8 relative z-20 shrink-0">
      <div className="flex items-center gap-4">
        {/* Mobile Menu Trigger */}
        <button
          onClick={onMenuToggle}
          className="md:hidden p-2 -ml-2 text-gray-400 hover:text-white transition-colors"
        >
          <Menu size={24} />
        </button>

        <h1 className="text-xl md:text-2xl font-bold text-white">{title}</h1>
      </div>

      <div className="flex items-center gap-4" ref={popoverRef}>
        <div className="hidden sm:flex flex-col items-end">
          <span className="text-xs text-gray-500 uppercase">Welcome back</span>
          <span className="text-sm font-bold text-white max-w-[150px] truncate">
            {user?.username || "Trader"}
          </span>
        </div>

        <button
          onClick={() => setIsProfileOpen(!isProfileOpen)}
          className={`w-10 h-10 rounded-full bg-gradient-to-br ${getAvatarGradient(
            user?.username || ""
          )} border border-white/10 hover:scale-105 transition-transform shadow-lg flex items-center justify-center`}
        >
          {user?.username ? (
            <span className="text-xs font-bold text-white tracking-wider">
              {getInitials(user.username)}
            </span>
          ) : (
            <User size={18} className="text-white/50" />
          )}
        </button>

        {isProfileOpen && (
          <div className="absolute top-16 right-4 md:right-6 w-64 bg-[#111] border border-white/10 rounded-xl shadow-2xl p-4 animate-in slide-in-from-top-2 z-50">
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/5">
              <div
                className={`w-12 h-12 rounded-full bg-gradient-to-br ${getAvatarGradient(
                  user?.username || ""
                )} flex items-center justify-center`}
              >
                <span className="text-lg font-bold text-white uppercase">
                  {getInitials(user?.username || "")}
                </span>
              </div>
              <div className="overflow-hidden">
                <h4 className="text-white font-bold truncate">
                  {user?.username}
                </h4>
                <span className="text-xs text-neon-green px-2 py-0.5 bg-neon-green/10 rounded uppercase font-bold tracking-wider">
                  {user?.role || "USER"}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <div>
                <label className="text-[10px] text-gray-500 uppercase font-bold">
                  Email
                </label>
                <p className="text-gray-300 text-sm truncate">{user?.email}</p>
              </div>
              <div>
                <label className="text-[10px] text-gray-500 uppercase font-bold">
                  User ID
                </label>
                <p className="text-gray-300 text-xs font-mono truncate opacity-50">
                  {user?.id}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
