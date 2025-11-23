import React, { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { UserProfile } from "../../types/api";
import { userService } from "../../features/auth/api/userService";

export const DashboardLayout: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State for Mobile Sidenav
  const location = useLocation();
  const navigate = useNavigate();

  // Close mobile menu whenever route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const getPageTitle = () => {
    switch (location.pathname) {
      case "/dashboard":
        return "Dashboard";
      case "/journal":
        return "Journal";
      default:
        return "TradeLog";
    }
  };

  useEffect(() => {
    userService.getProfile().catch(() => navigate("/auth/login"));
    userService.getProfile().then(setUser);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/");
  };

  return (
    <div className="flex h-screen bg-dark-bg overflow-hidden font-sans text-gray-200">
      {/* Sidebar receives visibility props */}
      <Sidebar
        onLogout={handleLogout}
        isMobileOpen={isMobileMenuOpen}
        onMobileClose={() => setIsMobileMenuOpen(false)}
      />

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Header gets toggle function */}
        <Header
          user={user}
          title={getPageTitle()}
          onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />

        <Outlet context={{ user }} />
      </main>
    </div>
  );
};
