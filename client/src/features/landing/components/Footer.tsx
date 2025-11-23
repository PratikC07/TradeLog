import React from "react";
import { Twitter, Github, Mail } from "../../../components/ui/Icons";
import { Logo } from "../../../components/ui/Logo";

export const Footer: React.FC = () => {
  return (
    <footer
      id="contact"
      className="bg-[#020202] pt-20 md:pt-32 pb-12 px-6 border-t border-white/10 scroll-mt-20 relative overflow-hidden"
    >
      {/* Decorative large text */}
      <div className="absolute -bottom-10 -left-10 text-[120px] md:text-[200px] font-black text-white/[0.02] pointer-events-none select-none leading-none overflow-hidden">
        TRADELOG
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 mb-20">
          <div className="max-w-md">
            {/* Footer Logo */}
            <div
              className="flex items-center gap-2 font-bold text-2xl tracking-tighter text-white mb-6 group cursor-pointer w-fit"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <Logo />
              <span className="group-hover:text-neon-green transition-colors">
                TradeLog
              </span>
            </div>
            <p className="text-gray-400 mb-8 leading-relaxed text-lg">
              The ultimate trading journal for professional traders. Track,
              analyze, and improve your edge with AI-powered insights.
            </p>

            {/* Newsletter Signup */}
            <div className="mb-8">
              <h5 className="text-white font-semibold mb-2">
                Stay ahead of the market
              </h5>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-neon-green/50 flex-1 w-full"
                />
                <button className="bg-white text-black font-bold px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors whitespace-nowrap">
                  Join
                </button>
              </div>
            </div>

            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:bg-white/10 hover:text-white transition-all hover:scale-110"
              >
                <Twitter size={20} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:bg-white/10 hover:text-white transition-all hover:scale-110"
              >
                <Github size={20} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:bg-white/10 hover:text-white transition-all hover:scale-110"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 pt-4">
            <div>
              <h4 className="text-white font-bold mb-6">Platform</h4>
              <ul className="space-y-4 text-gray-400 text-sm">
                <li>
                  <a
                    href="#"
                    className="hover:text-neon-green transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-neon-green transition-colors"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-neon-green transition-colors"
                  >
                    Security
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-neon-green transition-colors"
                  >
                    Changelog
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6">Company</h4>
              <ul className="space-y-4 text-gray-400 text-sm">
                <li>
                  <a
                    href="#"
                    className="hover:text-neon-green transition-colors"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-neon-green transition-colors"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-neon-green transition-colors"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-neon-green transition-colors"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6">Legal</h4>
              <ul className="space-y-4 text-gray-400 text-sm">
                <li>
                  <a
                    href="#"
                    className="hover:text-neon-green transition-colors"
                  >
                    Privacy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-neon-green transition-colors"
                  >
                    Terms
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-neon-green transition-colors"
                  >
                    Cookies
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <div>&copy; 2024 TradeLog Inc. All rights reserved.</div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            <span>All Systems Operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
