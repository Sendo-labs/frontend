import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronDown, Bot, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

import HeroSection from "../components/home/HeroSection";
import HowItWorksSection from "../components/home/HowItWorksSection";
import StatisticsSection from "../components/home/StatisticsSection";
import TeamSection from "../components/home/TeamSection";
import ContactSection from "../components/home/ContactSection";
import ResultsModal from "../components/home/ResultsModal";

// 5 sections au total: hero + how it works + stats + team + contact
const totalSections = 5;

export default function Home() {
  const [currentSection, setCurrentSection] = useState(0);
  const [walletAddress, setWalletAddress] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [resultsData, setResultsData] = useState(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Desktop scroll only
  useEffect(() => {
    const handleWheel = (e) => {
      if (window.innerWidth >= 768 && !isScrolling) {
        e.preventDefault();
        setIsScrolling(true);
        
        if (e.deltaY > 0 && currentSection < totalSections - 1) {
          setCurrentSection(prev => prev + 1);
        } else if (e.deltaY < 0 && currentSection > 0) {
          setCurrentSection(prev => prev - 1);
        }
        
        setTimeout(() => setIsScrolling(false), 1000);
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [currentSection, isScrolling]);

  const handleAnalyze = async () => {
    if (!walletAddress.trim()) return;
    
    setIsAnalyzing(true);
    
    setTimeout(() => {
      setResultsData({
        wallet: walletAddress,
        totalMissed: 847392.50,
        topMisses: [
          { token: "BONK", missed: 234567.89, ath: 0.000045, soldAt: 0.000012 },
          { token: "WIF", missed: 189234.12, ath: 3.45, soldAt: 0.89 },
          { token: "SAMO", missed: 156789.34, ath: 0.234, soldAt: 0.067 },
        ]
      });
      setIsAnalyzing(false);
      setShowResults(true);
    }, 2000);
  };

  const handleAgentClick = (e) => {
    e.preventDefault();
    window.location.href = createPageUrl("Agent") + "?action=scan";
  };

  const navLinks = [
    { name: "Wallet Analyzer", path: "Dashboard" },
    { name: "Agent", path: "Agent" },
    { name: "Marketplace", path: "Marketplace" },
    { name: "Looserboard", path: "Leaderboard" }
  ];

  const getNavbarStyle = () => {
    if (currentSection === 0) {
      return "bg-black/40 border-white/20";
    } else {
      return "bg-black/60 border-white/30";
    }
  };

  return (
    <>
      {/* Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50 pt-5">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className={`w-full border backdrop-blur-sm transition-all duration-500 ${getNavbarStyle()}`}
            style={{
              clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)'
            }}
          >
            <div className="px-4 sm:px-6 py-3 sm:py-4">
              <div className="flex items-center justify-between">
                <Link to={createPageUrl("Home")} className="flex-shrink-0">
                  <img 
                    src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68de5637652a326681f5a5a3/6ee61bcb6_SENDO_white2x.png"
                    alt="SENDO"
                    className="h-5 sm:h-6"
                  />
                </Link>

                <nav className="hidden md:flex items-center gap-2 lg:gap-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={createPageUrl(link.path)}
                      className="px-3 lg:px-4 py-2 text-xs lg:text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-all"
                    >
                      {link.name}
                    </Link>
                  ))}
                </nav>

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

              {mobileMenuOpen && (
                <motion.nav 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="md:hidden mt-4 pt-4 border-t border-white/10"
                >
                  <div className="flex flex-col gap-2">
                    {navLinks.map((link) => (
                      <Link
                        key={link.path}
                        to={createPageUrl(link.path)}
                        onClick={() => setMobileMenuOpen(false)}
                        className="px-4 py-2 text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-all"
                      >
                        {link.name}
                      </Link>
                    ))}
                  </div>
                </motion.nav>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Desktop Version - Snap Scroll */}
      <div className="hidden md:block relative w-full h-screen overflow-hidden bg-black">
        {/* Navigation Dots */}
        <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-4">
          {Array.from({ length: totalSections }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSection(index)}
              className={`w-3 h-3 transition-all duration-300 ${
                currentSection === index 
                  ? "bg-white w-3 h-8" 
                  : "bg-white/20 hover:bg-white/40"
              }`}
            />
          ))}
        </div>

        {/* Sections Container */}
        <motion.div
          className="relative w-full"
          style={{ height: `${totalSections * 100}vh` }}
          animate={{ y: `-${currentSection * 100}vh` }}
          transition={{ duration: 0.8, ease: [0.6, 0.05, 0.01, 0.9] }}
        >
          {/* Hero - Section 0 */}
          <div className="absolute top-0 left-0 w-full h-screen">
            <HeroSection 
              walletAddress={walletAddress}
              setWalletAddress={setWalletAddress}
              handleAnalyze={handleAnalyze}
              isAnalyzing={isAnalyzing}
            />
          </div>
          
          {/* How It Works - Section 1 */}
          <div className="absolute left-0 w-full h-screen" style={{ top: '100vh' }}>
            <HowItWorksSection />
          </div>
          
          {/* Statistics - Section 2 */}
          <div className="absolute left-0 w-full h-screen" style={{ top: '200vh' }}>
            <StatisticsSection />
          </div>
          
          {/* Team - Section 3 */}
          <div className="absolute left-0 w-full h-screen" style={{ top: '300vh' }}>
            <TeamSection />
          </div>
          
          {/* Contact - Section 4 */}
          <div className="absolute left-0 w-full h-screen" style={{ top: '400vh' }}>
            <ContactSection />
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        {currentSection < totalSections - 1 && (
          <motion.div
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40"
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <ChevronDown className="w-8 h-8 text-white/60" />
          </motion.div>
        )}
        
        {/* Agent Button */}
        <motion.button
          onClick={handleAgentClick}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="fixed bottom-8 right-8 z-50 w-16 h-16 bg-gradient-to-r from-[#FF5C1A] via-[#FF223B] to-[#30080C] flex items-center justify-center shadow-lg shadow-[#FF5C1A]/50 hover:scale-110 transition-transform group cursor-pointer"
          type="button"
          style={{
            clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%)'
          }}
        >
          <Bot className="w-8 h-8 text-white group-hover:scale-110 transition-transform" />
        </motion.button>
      </div>

      {/* Mobile Version - Simple Free Scroll */}
      <div className="md:hidden w-full min-h-screen bg-black">
        <div className="w-full">
          <HeroSection 
            walletAddress={walletAddress}
            setWalletAddress={setWalletAddress}
            handleAnalyze={handleAnalyze}
            isAnalyzing={isAnalyzing}
          />
        </div>
        <div className="w-full">
          <HowItWorksSection />
        </div>
        <div className="w-full">
          <StatisticsSection />
        </div>
        <div className="w-full">
          <TeamSection />
        </div>
        <div className="w-full">
          <ContactSection />
        </div>
        
        <motion.button
          onClick={handleAgentClick}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-r from-[#FF5C1A] via-[#FF223B] to-[#30080C] flex items-center justify-center shadow-lg shadow-[#FF5C1A]/50 hover:scale-110 transition-transform group cursor-pointer"
          type="button"
          style={{
            clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%)'
          }}
        >
          <Bot className="w-7 h-7 text-white group-hover:scale-110 transition-transform" />
        </motion.button>
      </div>

      <ResultsModal 
        isOpen={showResults}
        onClose={() => setShowResults(false)}
        data={resultsData}
      />
    </>
  );
}