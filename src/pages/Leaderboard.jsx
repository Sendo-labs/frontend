
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, TrendingDown, TrendingUp, Crown, Skull } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function Leaderboard() {
  const [activeTab, setActiveTab] = useState("shame");
  const [isLoading, setIsLoading] = useState(true);
  const [leaderboardData, setLeaderboardData] = useState(null);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    // Mock API call
    setTimeout(() => {
      setLeaderboardData({
        shame: [
          { wallet: "9W3xHj9kUK7eJXR3QMNz6T8f2A4vPkLmC5dN1sB6wX9Y", total_missed_usd: 98210, rank: "🐳 Elite of Pain", badge: "diamond" },
          { wallet: "7hpWn64kb0q5nro2ZGX9TkP3Y8fLmA1sC6dN4wB5xJ2H", total_missed_usd: 67834, rank: "💀 Certified Bagholder", badge: "gold" },
          { wallet: "5ZV3HcSDmmSoump8N2mT6P9fK4rLvC3dN1sB7wX8yM4K", total_missed_usd: 43810, rank: "💎 Diamond Hands (Wrong Way)", badge: "silver" },
          { wallet: "3qp2G1s4t8m9N6Y7K2P4F5rLmC1dN8sB3wX4yJ5H", total_missed_usd: 38921, rank: "🎯 Master of Mistiming", badge: "bronze" },
          { wallet: "8TkP3Y2f4LmA5s1C6dN9wB2xJ7H3qp4G1s8t9m0N", total_missed_usd: 32450, rank: "📉 Professional Holder" },
          { wallet: "6dN1sB7wX8yM4K2P9fK4rLvC3ZV3HcSDmmSoump8N", total_missed_usd: 28730, rank: "🤡 Clown Prince" },
          { wallet: "4G1s8t9m0N6Y7K2P4F5rLmC1dN8sB3wX4yJ5H3qp2", total_missed_usd: 24180, rank: "🚀 Rocket to the Ground" },
          { wallet: "2f4LmA5s1C6dN9wB2xJ7H3qp4G1s8t9m0N8TkP3Y", total_missed_usd: 19560, rank: "💸 Money Burner" },
          { wallet: "7wX8yM4K2P9fK4rLvC3ZV3HcSDmmSoump8N6dN1sB", total_missed_usd: 15320, rank: "🎰 Casino Enthusiast" },
          { wallet: "8t9m0N6Y7K2P4F5rLmC1dN8sB3wX4yJ5H3qp24G1s", total_missed_usd: 12840, rank: "🔥 Burn Master" }
        ],
        fame: [
          { wallet: "2Y9wX8hK7M4vPkN6dN1sB9fK3rLvC5ZV3HcSDmmSo", total_gains_usd: 145320, rank: "👑 Exit Legend", badge: "diamond" },
          { wallet: "5H3qp4G1s8t9m0N6Y7K2P4F5rLmC1dN8sB3wX4yJ", total_gains_usd: 98450, rank: "🎯 Perfect Timer", badge: "gold" },
          { wallet: "8N6dN1sB7wX8yM4K2P9fK4rLvC3ZV3HcSDmmSoump", total_gains_usd: 76210, rank: "💰 Profit Master", badge: "silver" },
          { wallet: "1C6dN9wB2xJ7H3qp4G1s8t9m0N8TkP3Y2f4LmA5s", total_gains_usd: 63840, rank: "🚀 Moon Walker", badge: "bronze" },
          { wallet: "9fK4rLvC3ZV3HcSDmmSoump8N6dN1sB7wX8yM4K2P", total_gains_usd: 54720, rank: "⚡ Lightning Seller" },
          { wallet: "4yJ5H3qp24G1s8t9m0N6Y7K2P4F5rLmC1dN8sB3wX", total_gains_usd: 47890, rank: "🧠 Big Brain" },
          { wallet: "7K2P4F5rLmC1dN8sB3wX4yJ5H3qp2G1s8t9m0N6Y", total_gains_usd: 41230, rank: "🎪 Circus Master" },
          { wallet: "0N8TkP3Y2f4LmA5s1C6dN9wB2xJ7H3qp4G1s8t9m", total_gains_usd: 36540, rank: "💎 Diamond Hands (Right Way)" },
          { wallet: "3ZV3HcSDmmSoump8N6dN1sB7wX8yM4K2P9fK4rLvC", total_gains_usd: 29870, rank: "🏆 Champion" },
          { wallet: "6Y7K2P4F5rLmC1dN8sB3wX4yJ5H3qp24G1s8t9m0N", total_gains_usd: 24590, rank: "🌟 Star Player" }
        ]
      });
      setIsLoading(false);
    }, 1000);
  };

  const formatWallet = (wallet) => {
    return `${wallet.slice(0, 6)}...${wallet.slice(-6)}`;
  };

  const getBadgeColor = (badge) => {
    switch (badge) {
      case "diamond": return "from-[#b9f2ff] to-[#0ea5e9]";
      case "gold": return "from-[#ffd700] to-[#ffa500]";
      case "silver": return "from-[#e5e7eb] to-[#9ca3af]";
      case "bronze": return "from-[#f59e0b] to-[#92400e]";
      default: return "from-[#F2EDE7]/20 to-[#F2EDE7]/10";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <div className="text-center">
          <div
            className="w-16 h-16 border-4 border-[#FF6B00] border-t-transparent mx-auto mb-4"
            style={{ borderRadius: 0 }}
          />
          <p className="text-[#F2EDE7]/60 text-sm uppercase" style={{ fontFamily: 'TECHNOS, sans-serif' }}>
            Loading Leaderboard...
          </p>
        </div>
      </div>
    );
  }

  const currentData = activeTab === "shame" ? leaderboardData.shame : leaderboardData.fame;

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#F2EDE7]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-12 md:py-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 md:mb-16"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6" style={{ fontFamily: 'TECHNOS, sans-serif' }}>
            LEADER
            <span className="bg-gradient-to-r from-[#FF6B00] to-[#FF223B] bg-clip-text text-transparent">
              BOARD
            </span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-[#F2EDE7]/60 max-w-3xl mx-auto">
            The best and worst traders on Solana 🏆
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="flex gap-4 mb-8 md:mb-12 max-w-2xl mx-auto"
        >
          <button
            onClick={() => setActiveTab("shame")}
            className={`flex-1 h-14 md:h-16 flex items-center justify-center gap-2 transition-all ${
              activeTab === "shame"
                ? "bg-gradient-to-r from-[#FF6B00] to-[#FF223B]"
                : "bg-[#F2EDE7]/5 hover:bg-[#F2EDE7]/10"
            }`}
            style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)', borderRadius: 0 }}
          >
            <Skull className="w-5 h-5 md:w-6 md:h-6" />
            <span className="text-sm md:text-base font-bold uppercase" style={{ fontFamily: 'TECHNOS, sans-serif' }}>
              HALL OF SHAME
            </span>
          </button>

          <button
            onClick={() => setActiveTab("fame")}
            className={`flex-1 h-14 md:h-16 flex items-center justify-center gap-2 transition-all ${
              activeTab === "fame"
                ? "bg-gradient-to-r from-[#14F195] to-[#00D9B5]"
                : "bg-[#F2EDE7]/5 hover:bg-[#F2EDE7]/10"
            }`}
            style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)', borderRadius: 0 }}
          >
            <Trophy className="w-5 h-5 md:w-6 md:h-6" />
            <span className={`text-sm md:text-base font-bold uppercase ${activeTab === "fame" ? "text-black" : ""}`} style={{ fontFamily: 'TECHNOS, sans-serif' }}>
              HALL OF FAME
            </span>
          </button>
        </motion.div>

        {/* Leaderboard */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            {currentData.map((entry, index) => (
              <motion.div
                key={entry.wallet}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05, duration: 0.5 }}
                className={`relative overflow-hidden ${
                  entry.badge 
                    ? `bg-gradient-to-r ${getBadgeColor(entry.badge)} p-[2px]` 
                    : "bg-[#F2EDE7]/5 border border-[#F2EDE7]/10"
                }`}
                style={{ borderRadius: 0 }}
              >
                <div className="bg-[#0D0D0D] p-4 md:p-6" style={{ borderRadius: 0 }}>
                  <div className="flex items-center gap-4 md:gap-6">
                    {/* Rank Badge */}
                    <div className={`w-12 h-12 md:w-16 md:h-16 flex items-center justify-center flex-shrink-0 ${
                      entry.badge 
                        ? `bg-gradient-to-r ${getBadgeColor(entry.badge)}` 
                        : "bg-[#F2EDE7]/10"
                    }`} style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)' }}>
                      {index < 3 ? (
                        <Crown className={`w-6 h-6 md:w-8 md:h-8 ${
                          entry.badge === "diamond" ? "text-[#0ea5e9]" :
                          entry.badge === "gold" ? "text-[#ffd700]" :
                          entry.badge === "silver" ? "text-[#e5e7eb]" :
                          "text-[#f59e0b]"
                        }`} />
                      ) : (
                        <span className="text-lg md:text-2xl font-bold text-[#F2EDE7]" style={{ fontFamily: 'TECHNOS, sans-serif' }}>
                          #{index + 1}
                        </span>
                      )}
                    </div>

                    {/* Wallet Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-base md:text-lg font-bold text-[#F2EDE7] font-mono truncate">
                          {formatWallet(entry.wallet)}
                        </p>
                      </div>
                      <p className="text-sm md:text-base text-[#F2EDE7]/60">
                        {entry.rank}
                      </p>
                    </div>

                    {/* Amount */}
                    <div className="text-right flex-shrink-0">
                      <div className="flex items-center gap-2 mb-1">
                        {activeTab === "shame" ? (
                          <TrendingDown className="w-5 h-5 text-[#FF223B]" />
                        ) : (
                          <TrendingUp className="w-5 h-5 text-[#14F195]" />
                        )}
                        <p className={`text-xl md:text-3xl font-bold ${
                          activeTab === "shame" ? "text-[#FF223B]" : "text-[#14F195]"
                        }`} style={{ fontFamily: 'TECHNOS, sans-serif' }}>
                          ${activeTab === "shame" 
                            ? (entry.total_missed_usd / 1000).toFixed(1) 
                            : (entry.total_gains_usd / 1000).toFixed(1)
                          }K
                        </p>
                      </div>
                      <p className="text-xs md:text-sm text-[#F2EDE7]/40 uppercase">
                        {activeTab === "shame" ? "MISSED" : "GAINED"}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-12 md:mt-16 text-center"
        >
          <p className="text-[#F2EDE7]/60 mb-4 text-sm md:text-base">
            {activeTab === "shame" 
              ? "Think you can beat them? 💀" 
              : "Can you join the legends? 🏆"
            }
          </p>
          <Link to={createPageUrl("Analyzer")}>
            <Button
              className="bg-gradient-to-r from-[#FF6B00] to-[#FF223B] hover:shadow-lg hover:shadow-[#FF223B]/50 text-white h-12 md:h-14 px-6 md:px-8"
              style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)', borderRadius: 0 }}
            >
              <span className="text-sm md:text-base font-bold uppercase" style={{ fontFamily: 'TECHNOS, sans-serif' }}>
                ANALYZE YOUR WALLET
              </span>
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
