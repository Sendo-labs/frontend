import React, { useState } from "react";
import { ArrowLeft, Trophy, TrendingDown, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createPageUrl } from "@/utils";
import { Link } from "react-router-dom";

export default function Leaderboard() {
  // Mock data - à remplacer par vraies données
  const leaderboardData = [
    {
      rank: 1,
      wallet: "9W3xHj9kUK7eJXR3QMNz6T8f2A4vPkLmC5dN1sB6wX9Y",
      totalMissed: 2847392.50,
      topToken: "BONK",
      topLoss: 1234567.89
    },
    {
      rank: 2,
      wallet: "7hpWn64kb0q5nro2ZGX9TkP3Y8fLmA1sC6dN4wB5xJ2H",
      totalMissed: 1923847.32,
      topToken: "WIF",
      topLoss: 923847.32
    },
    {
      rank: 3,
      wallet: "5ZV3HcSDmmSoump8N2mT6P9fK4rLvC3dN1sB7wX8yM4K",
      totalMissed: 1547821.15,
      topToken: "SAMO",
      topLoss: 847821.15
    },
    {
      rank: 4,
      wallet: "3qp2G1s4t8m9N6Y7K2P4F5rLmC1dN8sB3wX4yJ5H",
      totalMissed: 1234567.89,
      topToken: "POPCAT",
      topLoss: 634567.89
    },
    {
      rank: 5,
      wallet: "8TkP3Y2f4LmA5s1C6dN9wB2xJ7H3qp4G1s8t9m0N",
      totalMissed: 987654.32,
      topToken: "MEW",
      topLoss: 487654.32
    },
    {
      rank: 6,
      wallet: "6dN1sB7wX8yM4K2P9fK4rLvC3ZV3HcSDmmSoump8N",
      totalMissed: 876543.21,
      topToken: "MYRO",
      topLoss: 376543.21
    },
    {
      rank: 7,
      wallet: "4G1s8t9m0N6Y7K2P4F5rLmC1dN8sB3wX4yJ5H3qp2",
      totalMissed: 765432.10,
      topToken: "FOXY",
      topLoss: 365432.10
    },
    {
      rank: 8,
      wallet: "2f4LmA5s1C6dN9wB2xJ7H3qp4G1s8t9m0N8TkP3Y",
      totalMissed: 654321.09,
      topToken: "SLERF",
      topLoss: 254321.09
    },
    {
      rank: 9,
      wallet: "7wX8yM4K2P9fK4rLvC3ZV3HcSDmmSoump8N6dN1sB",
      totalMissed: 543210.98,
      topToken: "WEN",
      topLoss: 243210.98
    },
    {
      rank: 10,
      wallet: "8t9m0N6Y7K2P4F5rLmC1dN8sB3wX4yJ5H3qp24G1s",
      totalMissed: 432109.87,
      topToken: "BOME",
      topLoss: 232109.87
    }
  ];

  const formatWallet = (wallet) => {
    return `${wallet.slice(0, 4)}...${wallet.slice(-4)}`;
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return <Crown className="w-6 h-6 text-[#FFD700]" />;
    if (rank === 2) return <Crown className="w-6 h-6 text-[#C0C0C0]" />;
    if (rank === 3) return <Crown className="w-6 h-6 text-[#CD7F32]" />;
    return <span className="text-white/40 font-bold">#{rank}</span>;
  };

  const handleWalletClick = (wallet) => {
    window.open(`${createPageUrl("Dashboard")}?wallet=${wallet}`, '_blank');
  };

  return (
    <>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-12">
        {/* Title */}
        <div className="text-center mb-12">
          <h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
            style={{ fontFamily: 'TECHNOS, sans-serif' }}
          >
            HALL OF{" "}
            <span className="bg-gradient-to-r from-[#FF5C1A] via-[#FF223B] to-[#30080C] bg-clip-text text-transparent">
              SHAME
            </span>
          </h1>
          <p className="text-lg text-white/60">The biggest diamond hands who held too long or sold too early</p>
        </div>

        {/* Top 3 Podium */}
        <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-5xl mx-auto">
          {/* Second Place */}
          <div className="md:order-1 order-2">
            <div className="bg-gradient-to-b from-[#C0C0C0]/20 to-transparent border border-[#C0C0C0]/30 p-6 text-center hover:scale-105 transition-transform cursor-pointer"
                 onClick={() => handleWalletClick(leaderboardData[1].wallet)}
                 style={{ borderRadius: 0 }}>
              <div className="flex justify-center mb-4">
                <Crown className="w-12 h-12 text-[#C0C0C0]" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">#2</div>
              <div className="text-sm text-white/60 mb-4 font-mono">
                {formatWallet(leaderboardData[1].wallet)}
              </div>
              <div className="text-2xl font-bold text-[#FF223B] mb-1">
                ${(leaderboardData[1].totalMissed / 1000000).toFixed(2)}M
              </div>
              <div className="text-xs text-white/40">MISSED AT ATH</div>
            </div>
          </div>

          {/* First Place */}
          <div className="md:order-2 order-1">
            <div className="bg-gradient-to-b from-[#FFD700]/20 to-transparent border border-[#FFD700]/30 p-8 text-center hover:scale-105 transition-transform cursor-pointer relative"
                 onClick={() => handleWalletClick(leaderboardData[0].wallet)}
                 style={{ borderRadius: 0 }}>
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#FF5C1A] via-[#FF223B] to-[#30080C] px-4 py-1 text-xs font-bold" style={{ borderRadius: 0 }}>
                BIGGEST LOSER
              </div>
              <div className="flex justify-center mb-4 mt-2">
                <Crown className="w-16 h-16 text-[#FFD700]" />
              </div>
              <div className="text-4xl font-bold text-white mb-2">#1</div>
              <div className="text-sm text-white/60 mb-4 font-mono">
                {formatWallet(leaderboardData[0].wallet)}
              </div>
              <div className="text-3xl font-bold text-[#FF223B] mb-1">
                ${(leaderboardData[0].totalMissed / 1000000).toFixed(2)}M
              </div>
              <div className="text-xs text-white/40">MISSED AT ATH</div>
            </div>
          </div>

          {/* Third Place */}
          <div className="md:order-3 order-3">
            <div className="bg-gradient-to-b from-[#CD7F32]/20 to-transparent border border-[#CD7F32]/30 p-6 text-center hover:scale-105 transition-transform cursor-pointer"
                 onClick={() => handleWalletClick(leaderboardData[2].wallet)}
                 style={{ borderRadius: 0 }}>
              <div className="flex justify-center mb-4">
                <Crown className="w-12 h-12 text-[#CD7F32]" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">#3</div>
              <div className="text-sm text-white/60 mb-4 font-mono">
                {formatWallet(leaderboardData[2].wallet)}
              </div>
              <div className="text-2xl font-bold text-[#FF223B] mb-1">
                ${(leaderboardData[2].totalMissed / 1000000).toFixed(2)}M
              </div>
              <div className="text-xs text-white/40">MISSED AT ATH</div>
            </div>
          </div>
        </div>

        {/* Full Leaderboard */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <Trophy className="w-6 h-6 text-[#FF5C1A]" />
            Full Leaderboard
          </h2>
          
          <div className="space-y-3">
            {leaderboardData.map((entry) => (
              <div
                key={entry.rank}
                onClick={() => handleWalletClick(entry.wallet)}
                className={`bg-white/5 border border-white/10 p-4 hover:bg-white/10 hover:border-[#FF5C1A]/50 transition-all cursor-pointer ${
                  entry.rank <= 3 ? 'border-[#FF5C1A]/30' : ''
                }`}
                style={{ borderRadius: 0 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 flex justify-center items-center">
                      {getRankIcon(entry.rank)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="text-white/60 text-xs mb-1">Wallet Address</div>
                      <div className="font-mono text-white font-semibold">
                        {formatWallet(entry.wallet)}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-white/60 text-xs mb-1">Top Loss</div>
                      <div className="text-white/80 text-sm">
                        {entry.topToken}: ${(entry.topLoss / 1000).toFixed(1)}k
                      </div>
                    </div>
                  </div>

                  <div className="text-right ml-6">
                    <div className="text-white/60 text-xs mb-1">Total Missed</div>
                    <div className="text-2xl font-bold text-[#FF223B]">
                      ${entry.totalMissed >= 1000000 
                        ? `${(entry.totalMissed / 1000000).toFixed(2)}M`
                        : `${(entry.totalMissed / 1000).toFixed(1)}k`
                      }
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center text-white/40 text-sm">
          <p>Rankings updated every 24 hours</p>
          <p className="mt-2">Click on any wallet to see their full analysis</p>
        </div>
      </div>
    </>
  );
}