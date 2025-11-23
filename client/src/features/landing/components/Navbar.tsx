import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "../../../components/ui/Icons";
import { Logo } from "../../../components/ui/Logo";

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const lastScrollY = useRef(0);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
        setIsHidden(true);
      } else {
        setIsHidden(false);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const navbarClasses = `fixed w-full z-50 top-0 px-6 transition-all duration-300 transform border-b ${
    isHidden && !isMobileMenuOpen ? "-translate-y-full" : "translate-y-0"
  } ${
    isScrolled || isMobileMenuOpen
      ? "bg-black/70 backdrop-blur-md border-white/10 py-4 shadow-lg"
      : "bg-transparent border-transparent py-6"
  }`;

  return (
    <nav className={navbarClasses}>
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Branding */}
        <div
          className="flex items-center gap-3 font-bold text-xl tracking-tighter cursor-pointer group select-none"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <div className="relative">
            <Logo />
          </div>
          <span className="text-white transition-all duration-300 group-hover:text-neon-green group-hover:drop-shadow-[0_0_8px_rgba(204,255,0,0.3)]">
            TradeLog
          </span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
          <a
            href="#features"
            className="hover:text-neon-green transition-colors"
          >
            Features
          </a>
          <a
            href="#reviews"
            className="hover:text-neon-green transition-colors"
          >
            Reviews
          </a>
          <a
            href="#contact"
            className="hover:text-neon-green transition-colors"
          >
            Contact
          </a>
        </div>
        <button
          onClick={() => navigate("/auth/login")}
          className="hidden md:block px-5 py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full text-sm font-medium transition-all hover:border-neon-green/50"
        >
          Sign In
        </button>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden text-white p-2" onClick={toggleMenu}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-black/95 backdrop-blur-xl border-b border-white/10 p-6 flex flex-col gap-6 md:hidden animate-in slide-in-from-top-5 shadow-2xl">
          <a
            href="#features"
            className="text-lg font-medium text-gray-300 hover:text-neon-green"
            onClick={toggleMenu}
          >
            Features
          </a>
          <a
            href="#reviews"
            className="text-lg font-medium text-gray-300 hover:text-neon-green"
            onClick={toggleMenu}
          >
            Reviews
          </a>
          <a
            href="#contact"
            className="text-lg font-medium text-gray-300 hover:text-neon-green"
            onClick={toggleMenu}
          >
            Contact
          </a>
          <div className="h-px bg-white/10 my-2"></div>
          <button
            onClick={() => {
              toggleMenu();
              navigate("/auth/login");
            }}
            className="w-full py-3 bg-neon-green text-black font-bold rounded-xl"
          >
            Sign In
          </button>
        </div>
      )}
    </nav>
  );
};
