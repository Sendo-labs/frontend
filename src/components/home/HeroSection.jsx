
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Crown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createPageUrl } from "@/utils";
import { Link } from "react-router-dom";

export default function HeroSection() {
  const [walletAddress, setWalletAddress] = useState("");
  const [imageScale, setImageScale] = useState(1.5);

  useEffect(() => {
    const timer = setTimeout(() => {
      setImageScale(1);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Top 3 loosers mock data
  const topLoosers = [
    { wallet: "9W3xHj9kUK7eJXR3QMNz6T8f2A4vPkLmC5dN1sB6wX9Y", missed: 2847392.50, rank: 1 },
    { wallet: "7hpWn64kb0q5nro2ZGX9TkP3Y8fLmA1sC6dN4wB5xJ2H", missed: 1923847.32, rank: 2 },
    { wallet: "5ZV3HcSDmmSoump8N2mT6P9fK4rLvC3dN1sB7wX8yM4K", missed: 1547821.15, rank: 3 }
  ];

  const getRankColor = (rank) => {
    if (rank === 1) return "text-[#FFD700]";
    if (rank === 2) return "text-[#C0C0C0]";
    if (rank === 3) return "text-[#CD7F32]";
    return "text-[#F2EDE7]/60";
  };

  const formatWallet = (wallet) => {
    return `${wallet.slice(0, 4)}...${wallet.slice(-4)}`;
  };

  const handleLooserClick = (wallet) => {
    window.open(`${createPageUrl("Analyzer")}?wallet=${wallet}`, '_blank');
  };

  const handleAnalyze = () => {
    if (walletAddress.trim()) {
      window.location.href = `${createPageUrl("Analyzer")}?wallet=${walletAddress}`;
    }
  };

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background avec dégradé */}
      <div className="absolute inset-0" style={{ zIndex: 0 }}>
        {/* Dégradé de couleur de fond - HORIZONTAL de gauche à droite */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#FFBDA3] via-[#FFA7B0] to-[#E89E9E]" />
        
        {/* Image du personnage */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ scale: 1.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
        >
          <div 
            className="absolute inset-0 bg-cover md:bg-contain bg-center bg-no-repeat"
            style={{ 
              backgroundImage: `url('https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68de5637652a326681f5a5a3/badd9c67d_banner-background-min.png')`,
              backgroundPosition: 'center center',
              imageRendering: 'high-quality'
            }}
          />
        </motion.div>
        
        {/* Dégradé vertical transparent vers noir pour la transition */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black" style={{ zIndex: 1 }} />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-4 sm:px-6 text-center py-20">

        {/* Tagline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 sm:mb-6 text-[#F2EDE7]"
          style={{ fontFamily: 'TECHNOS, sans-serif' }}
        >
          HOW MUCH DID
          <br />
          <span className="bg-gradient-to-r from-[#FF6B00] to-[#FF223B] bg-clip-text text-transparent">
            YOU LOSE?
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="text-base sm:text-lg md:text-xl lg:text-2xl text-[#F2EDE7]/80 mb-8 sm:mb-12 font-light"
        >
          Stop bagholding. Custom AI agents will catch the next ATH for you.
        </motion.p>

        {/* Wallet Input */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.8 }}
          className="max-w-2xl mx-auto"
        >
          <div className="relative">
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                type="text"
                placeholder="Enter your Solana wallet..."
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAnalyze()}
                className="h-12 sm:h-14 md:h-16 text-sm sm:text-base md:text-lg bg-[#F2EDE7]/10 border-[#F2EDE7]/20 text-[#F2EDE7] placeholder:text-[#F2EDE7]/40 focus:border-[#FF6B00] transition-all"
                style={{ borderRadius: 0 }}
              />
              <Button
                onClick={handleAnalyze}
                disabled={!walletAddress.trim()}
                className="h-12 sm:h-14 md:h-16 px-6 sm:px-8 text-sm sm:text-base md:text-lg whitespace-nowrap bg-gradient-to-r from-[#FF6B00] to-[#FF223B] hover:shadow-lg hover:shadow-[#FF223B]/50 text-white"
                style={{ fontFamily: 'TECHNOS, sans-serif', clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)', borderRadius: 0 }}
              >
                <Search className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                SCAN NOW
              </Button>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-[#F2EDE7]/40 mt-3 sm:mt-4">
            Example: 9W3xHj9kUK7eJXR3QMNz6T8f2A4vPkLmC5dN1sB6wX9Y
          </p>

          {/* Top 3 Loosers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.8 }}
            className="mt-8 sm:mt-10"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <Crown className="w-5 h-5 text-[#FF6B00]" />
              <p className="text-sm sm:text-base text-[#F2EDE7]/60 uppercase tracking-wider" style={{ fontFamily: 'TECHNOS, sans-serif' }}>
                BIGGEST LOOSERS TODAY
              </p>
            </div>
            
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              {topLoosers.map((looser) => (
                <div
                  key={looser.rank}
                  onClick={() => handleLooserClick(looser.wallet)}
                  className="bg-[#F2EDE7]/5 border border-[#F2EDE7]/10 p-3 sm:p-4 hover:bg-[#F2EDE7]/10 hover:border-[#FF6B00]/50 transition-all cursor-pointer group"
                  style={{ borderRadius: 0 }}
                >
                  <div className="flex items-center justify-center gap-1 sm:gap-2 mb-2">
                    <Crown className={`w-3 h-3 sm:w-4 sm:h-4 ${getRankColor(looser.rank)} group-hover:scale-110 transition-transform`} />
                    <span className={`text-lg sm:text-xl font-bold ${getRankColor(looser.rank)}`} style={{ fontFamily: 'TECHNOS, sans-serif' }}>
                      #{looser.rank}
                    </span>
                  </div>
                  <p className="text-[10px] sm:text-xs text-[#F2EDE7]/60 font-mono mb-2">
                    {formatWallet(looser.wallet)}
                  </p>
                  <p className="text-sm sm:text-base font-bold text-[#FF223B] group-hover:scale-105 transition-transform" style={{ fontFamily: 'TECHNOS, sans-serif' }}>
                    ${looser.missed >= 1000000 
                      ? `${(looser.missed / 1000000).toFixed(2)}M`
                      : `${(looser.missed / 1000).toFixed(0)}k`
                    }
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Gradient Overlay Bottom pour transition forte vers noir */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none" style={{ zIndex: 5 }} />
    </section>
  );
}
