

import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowLeft, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import BetaDisclaimer from "./components/BetaDisclaimer";

export default function Layout({ children, currentPageName }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHomePage = currentPageName === "Home";
  
  // Pages qui utilisent la navbar - Agent retiré
  const pagesWithNavbar = ["Dashboard", "Marketplace", "Leaderboard"];
  const shouldShowNavbar = pagesWithNavbar.includes(currentPageName);

  if (isHomePage || !shouldShowNavbar) {
    return (
      <>
        <style>{`
          @font-face {
            font-family: 'TECHNOS';
            src: url('https://cdn.prod.website-files.com/61b3737273405dd7b65eec4c/68e3cd8726651e5fccb99f93_Technos-PKDZP.otf') format('opentype');
            font-weight: normal;
            font-style: normal;
            font-display: swap;
          }
        `}</style>
        <BetaDisclaimer />
        {children}
      </>
    );
  }

  const navLinks = [
    { name: "Wallet Analyzer", path: "Dashboard" },
    { name: "Agent", path: "Agent" },
    { name: "Marketplace", path: "Marketplace" },
    { name: "Looserboard", path: "Leaderboard" }
  ];

  const isActive = (pageName) => currentPageName === pageName;

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <style>{`
        @font-face {
          font-family: 'TECHNOS';
          src: url('https://cdn.prod.website-files.com/61b3737273405dd7b65eec4c/68e3cd8726651e5fccb99f93_Technos-PKDZP.otf') format('opentype');
          font-weight: normal;
          font-style: normal;
          font-display: swap;
        }
      `}</style>

      {/* Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50 pt-5">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div
            className="w-full bg-black/40 border border-white/20 backdrop-blur-sm"
            style={{
              clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)'
            }}
          >
            <div className="px-4 sm:px-6 py-3 sm:py-4">
              <div className="flex items-center justify-between">
                {/* Logo avec Back Button */}
                <div className="flex items-center gap-4">
                  <Link to={createPageUrl("Home")}>
                    <Button variant="ghost" size="icon" className="text-white/60 hover:text-white hover:bg-white/10">
                      <ArrowLeft className="w-5 h-5" />
                    </Button>
                  </Link>
                  
                  <Link to={createPageUrl("Home")} className="flex-shrink-0">
                    <img 
                      src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68de5637652a326681f5a5a3/6ee61bcb6_SENDO_white2x.png"
                      alt="SENDO"
                      className="h-5 sm:h-6"
                    />
                  </Link>
                </div>

                {/* Navigation Links - Desktop & Tablet */}
                <nav className="hidden md:flex items-center gap-2 lg:gap-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={createPageUrl(link.path)}
                      className={`px-3 lg:px-4 py-2 text-xs lg:text-sm font-medium transition-all ${
                        isActive(link.path)
                          ? "bg-white text-black"
                          : "text-white/70 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      {link.name}
                    </Link>
                  ))}
                </nav>

                {/* Mobile Menu Button */}
                <button 
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="md:hidden text-white/80 hover:text-white p-2"
                >
                  {mobileMenuOpen ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <Menu className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Mobile Menu */}
              {mobileMenuOpen && (
                <div className="md:hidden mt-4 pt-4 border-t border-white/10">
                  <div className="flex flex-col gap-2">
                    {navLinks.map((link) => (
                      <Link
                        key={link.path}
                        to={createPageUrl(link.path)}
                        onClick={handleLinkClick}
                        className={`px-4 py-2 text-sm font-medium transition-all ${
                          isActive(link.path)
                            ? "bg-white text-black"
                            : "text-white/70 hover:text-white hover:bg-white/10"
                        }`}
                      >
                        {link.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content with padding top for navbar */}
      <div className="pt-24">
        {children}
      </div>
    </div>
  );
}

