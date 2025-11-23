import React from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, LineChart, LogOut, X } from "../ui/Icons";
import { Logo } from "../ui/Logo";

interface SidebarProps {
  onLogout: () => void;
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  onLogout,
  isMobileOpen,
  onMobileClose,
}) => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const NavLink = ({
    to,
    icon: Icon,
    label,
  }: {
    to: string;
    icon: any;
    label: string;
  }) => (
    <Link to={to} className="w-full" onClick={onMobileClose}>
      <button
        className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-200
            ${
              isActive(to)
                ? "bg-white/5 text-neon-green shadow-[0_0_20px_-5px_rgba(204,255,0,0.1)]"
                : "text-gray-400 hover:bg-white/5 hover:text-white"
            }
            ${
              isMobileOpen ? "justify-start" : "justify-center lg:justify-start"
            }`}
      >
        <Icon size={20} className="shrink-0" />
        <span
          className={`font-medium ${
            isMobileOpen ? "block" : "hidden lg:block"
          }`}
        >
          {label}
        </span>
      </button>
    </Link>
  );

  return (
    <>
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden"
          onClick={onMobileClose}
        />
      )}

      <aside
        className={`
        fixed inset-y-0 left-0 z-50 bg-black border-r border-white/5 flex flex-col justify-between transition-transform duration-300 ease-in-out
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        md:relative md:translate-x-0 md:flex
        w-64 md:w-20 lg:w-64 
      `}
      >
        <div>
          <div
            className={`h-20 flex items-center px-6 border-b border-white/5 ${
              isMobileOpen
                ? "justify-between"
                : "md:justify-center lg:justify-start"
            }`}
          >
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="relative shrink-0">
                <Logo />
              </div>
              <span
                className={`font-bold text-xl tracking-tighter text-white group-hover:text-neon-green transition-colors ${
                  isMobileOpen ? "block" : "hidden lg:block"
                }`}
              >
                TradeLog
              </span>
            </div>
            <button
              onClick={onMobileClose}
              className="md:hidden text-gray-400 hover:text-white"
            >
              <X size={24} />
            </button>
          </div>
          <nav
            className={`p-4 space-y-2 flex flex-col ${
              isMobileOpen ? "items-stretch" : "items-center lg:items-stretch"
            }`}
          >
            <NavLink to="/dashboard" icon={LayoutDashboard} label="Dashboard" />
            <NavLink to="/journal" icon={LineChart} label="Journal" />
          </nav>
        </div>
        <div className="p-4 border-t border-white/5 md:border-none">
          <button
            onClick={onLogout}
            className={`w-full flex items-center gap-4 p-3 rounded-xl hover:bg-red-500/10 text-gray-400 hover:text-red-500 transition-colors ${
              isMobileOpen ? "justify-start" : "justify-center lg:justify-start"
            }`}
          >
            <LogOut size={20} className="shrink-0" />
            <span
              className={`font-medium ${
                isMobileOpen ? "block" : "hidden lg:block"
              }`}
            >
              Logout
            </span>
          </button>
        </div>
      </aside>
    </>
  );
};
