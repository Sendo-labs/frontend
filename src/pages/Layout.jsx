
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Menu, X } from "lucide-react";
import AgentPanel from "@/components/AgentPanel";

export default function Layout({ children, currentPageName }) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const location = useLocation();
  
  const navLinks = [
    { name: "ANALYZER", path: "Analyzer" },
    { name: "WORKER", path: "Worker" },
    { name: "MARKETPLACE", path: "Marketplace" },
    { name: "LEADERBOARD", path: "Leaderboard" }
  ];

  const isActive = (pageName) => currentPageName === pageName;

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#F2EDE7]">
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
            className="w-full bg-[#0D0D0D]/80 border border-[#F2EDE7]/10 backdrop-blur-sm"
            style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)' }}
          >
            <div className="px-4 sm:px-6 py-3 sm:py-4">
              <div className="flex items-center justify-between">
                <Link to={createPageUrl("Home")} className="flex-shrink-0">
                  <img 
                    src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68de5637652a326681f5a5a3/6ee61bcb6_SENDO_white2x.png"
                    alt="sEnDO"
                    className="h-5 sm:h-6"
                  />
                </Link>

                <nav className="hidden md:flex items-center gap-2 lg:gap-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={createPageUrl(link.path)}
                      className={`px-3 lg:px-4 py-2 text-xs lg:text-sm font-medium transition-all uppercase ${
                        isActive(link.path)
                          ? "bg-[#F2EDE7] text-[#0D0D0D]"
                          : "text-[#F2EDE7]/70 hover:text-[#F2EDE7] hover:bg-[#F2EDE7]/10"
                      }`}
                      style={{ borderRadius: 0 }}
                    >
                      {link.name}
                    </Link>
                  ))}
                </nav>

                <button 
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="md:hidden text-[#F2EDE7]/80 hover:text-[#F2EDE7] p-2"
                >
                  {mobileMenuOpen ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <Menu className="w-5 h-5" />
                  )}
                </button>
              </div>

              {mobileMenuOpen && (
                <nav className="md:hidden mt-4 pt-4 border-t border-[#F2EDE7]/10">
                  <div className="flex flex-col gap-2">
                    {navLinks.map((link) => (
                      <Link
                        key={link.path}
                        to={createPageUrl(link.path)}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`px-4 py-2 text-sm font-medium transition-all uppercase ${
                          isActive(link.path)
                            ? "bg-[#F2EDE7] text-[#0D0D0D]"
                            : "text-[#F2EDE7]/70 hover:text-[#F2EDE7] hover:bg-[#F2EDE7]/10"
                        }`}
                        style={{ borderRadius: 0 }}
                      >
                        {link.name}
                      </Link>
                    ))}
                  </div>
                </nav>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content with padding top for navbar */}
      <div className={currentPageName === "Home" ? "pt-0" : "pt-24"}>
        {children}
      </div>

      {/* Agent Panel - Floating on all pages */}
      <AgentPanel context={{ page: currentPageName, location: location.pathname }} />
    </div>
  );
}
