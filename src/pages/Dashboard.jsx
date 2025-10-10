import React, { useState } from "react";
import { ArrowLeft, TrendingUp, TrendingDown, Wallet, Coins, Target, Activity, Twitter, Send, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createPageUrl } from "@/utils";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("pnl");
  const [filterTab, setFilterTab] = useState("all");

  // Mock data - à remplacer par vraies données
  const walletData = {
    address: "9W3xHj9kUK7eJXR3QMNz6T8f2A4vPkLmC5dN1sB6wX9Y",
    totalMissedATH: 847392.50,
    statistics: {
      signatures: 2000,
      sol: 1551.8204,
      nfts: 2,
      tokens: 47
    },
    totals: {
      volumeTotal: 22.444,
      pnlTotal: 11.692,
      successRate: 50.0,
      tokensAnalyzed: 6
    },
    distribution: {
      inProfit: { count: 3, percentage: 50 },
      inLoss: { count: 2, percentage: 33.3 },
      fullySold: { count: 4, percentage: 66.7 },
      stillHeld: { count: 2, percentage: 33.3 }
    },
    bestPerformer: {
      token: "5ZV3HcSD",
      pnl: 12.222,
      volume: 14.932
    },
    worstPerformer: {
      token: "75SxTSq8",
      pnl: -8.4216,
      volume: 1.734
    },
    tokens: [
      {
        name: "Token 5ZV3HcSD",
        ticker: "5ZV3HcSD",
        address: "5ZV3HcSD...mmSoump",
        volumeTotal: 14.932,
        pnlRealized: 12.222,
        tokensHeld: 0,
        ath: 0.000000,
        status: "profit",
        transactions: 8,
        badges: ["Sold", "Profit"]
      },
      {
        name: "Token oXMQ4uCv",
        ticker: "oXMQ4uCv",
        address: "oXMQ4uCv...kbqSbumk",
        volumeTotal: 0.518,
        pnlRealized: 0.1334,
        tokensHeld: 0,
        ath: 0.000000,
        status: "profit",
        transactions: 3,
        badges: ["Sold", "Profit"]
      },
      {
        name: "Token Bg34H2jy",
        ticker: "Bg34H2jy",
        address: "Bg34H2jy...JEnKGmnp",
        volumeTotal: 1.485,
        pnlRealized: 0.0566,
        tokensHeld: 0,
        ath: 0.000000,
        status: "profit",
        transactions: 2,
        badges: ["Sold", "Profit"]
      },
      {
        name: "Pump.fun Token",
        ticker: "PUMP",
        address: "7hpWn64...kb0q5nro",
        volumeTotal: 0.9251,
        pnlRealized: -0.2251,
        tokensHeld: 15535577.16,
        ath: 0.000000,
        status: "loss",
        transactions: 1,
        badges: ["Holding", "Loss"]
      },
      {
        name: "Token LHywvDs4",
        ticker: "LHywvDs4",
        address: "LHywvDs4...Tkqq2oms",
        volumeTotal: 1.934,
        pnlRealized: -0.2987,
        tokensHeld: 0,
        ath: 0.000000,
        status: "loss",
        transactions: 1,
        badges: ["Sold", "Loss"]
      },
      {
        name: "Token 75SxTSq8",
        ticker: "75SxTSq8",
        address: "75SxTSq8...vXqq8Oms",
        volumeTotal: 1.734,
        pnlRealized: -8.4216,
        tokensHeld: 13389101.822,
        ath: 0.000000,
        status: "loss",
        transactions: 0,
        badges: ["Holding", "Loss"]
      }
    ]
  };

  const filteredTokens = walletData.tokens.filter(token => {
    if (filterTab === "all") return true;
    if (filterTab === "profit") return token.status === "profit";
    if (filterTab === "loss") return token.status === "loss";
    if (filterTab === "held") return token.tokensHeld > 0;
    if (filterTab === "sold") return token.tokensHeld === 0;
    return true;
  });

  // Top 3 des plus grosses pertes pour le récap
  const topMisses = [
    { token: "BONK", missed: 234567.89, ath: 0.000045, soldAt: 0.000012 },
    { token: "WIF", missed: 189234.12, ath: 3.45, soldAt: 0.89 },
    { token: "SAMO", missed: 156789.34, ath: 0.234, soldAt: 0.067 },
  ];

  const handleShare = async (platform) => {
    const message = `I missed $${walletData.totalMissedATH.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} by not selling at ATH! 😭\n\nCheck your losses at https://sendo.io`;
    const encodedMessage = encodeURIComponent(message);
    
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodedMessage}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent('https://sendo.io')}&text=${encodedMessage}`,
      discord: `https://discord.com/channels/@me`
    };
    
    if (urls[platform]) {
      window.open(urls[platform], '_blank');
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-12">
      {/* Wallet Address */}
      <div className="mb-8">
        <p className="text-xs text-white/40 uppercase tracking-wider mb-2">Wallet Address</p>
        <div className="bg-white/5 border border-white/10 p-3 sm:p-4 overflow-hidden" style={{ borderRadius: 0 }}>
          <p className="text-xs sm:text-sm font-mono text-white/80 break-all">{walletData.address}</p>
        </div>
      </div>

      {/* ATH MISSED HERO SECTION */}
      <div className="mb-8 relative overflow-hidden bg-gradient-to-r from-[#1a1a1a] to-[#0a0a0a] border-2 border-[#FF223B]/30" style={{ borderRadius: 0 }}>
        <div className="grid md:grid-cols-2 gap-0">
          {/* Left side - Data */}
          <div className="p-6 md:p-10 flex flex-col justify-center">
            <div className="mb-6">
              <p className="text-white/60 text-sm uppercase tracking-wider mb-2">
                Total Missed at ATH
              </p>
              <div className="text-4xl md:text-5xl lg:text-6xl font-bold mb-2">
                <span className="bg-gradient-to-r from-[#FF5C1A] via-[#FF223B] to-[#30080C] bg-clip-text text-transparent">
                  ${walletData.totalMissedATH.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </span>
              </div>
              <p className="text-white/40 text-sm">
                You could've been rich... but you held 💎🙌
              </p>
            </div>

            {/* Top 3 Misses */}
            <div className="space-y-3 mb-6">
              <h3 className="text-white/80 text-xs uppercase tracking-wider">Top Pain Points</h3>
              {topMisses.map((miss, index) => (
                <div
                  key={index}
                  className="bg-white/5 border border-white/10 p-3 hover:bg-white/10 transition-colors"
                  style={{ borderRadius: 0 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-gradient-to-r from-[#FF5C1A] via-[#FF223B] to-[#30080C] flex items-center justify-center font-bold text-white text-xs" style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%)' }}>
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-white font-semibold text-sm">{miss.token}</p>
                        <p className="text-white/50 text-xs">ATH: ${miss.ath} • Sold: ${miss.soldAt}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[#FF223B] font-bold">-${miss.missed.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Share Buttons */}
            <div>
              <h3 className="text-white/80 text-xs uppercase tracking-wider mb-3">Share Your Pain</h3>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  onClick={() => handleShare('twitter')}
                  className="h-10 bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white"
                  style={{ borderRadius: 0 }}
                >
                  <Twitter className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => handleShare('telegram')}
                  className="h-10 bg-[#0088cc] hover:bg-[#0077b3] text-white"
                  style={{ borderRadius: 0 }}
                >
                  <Send className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => handleShare('discord')}
                  className="h-10 bg-[#5865F2] hover:bg-[#4752c4] text-white"
                  style={{ borderRadius: 0 }}
                >
                  <MessageCircle className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Right side - Character pointing left */}
          <div className="relative hidden md:flex items-end justify-center overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLnJnLzIwMDAvc3ZnIj4PZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNMTAgMCBMIDAgMCAwIDEwIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-50" />
            <img
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68de5637652a326681f5a5a3/95c535eac_left_character_zoom.png"
              alt="SENDO pointing"
              className="relative z-10 h-full w-auto object-contain object-bottom"
            />
          </div>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white/5 border border-white/10 p-4" style={{ borderRadius: 0 }}>
          <div className="text-2xl font-bold bg-gradient-to-r from-[#FF5C1A] via-[#FF223B] to-[#30080C] bg-clip-text text-transparent mb-1">
            {walletData.statistics.signatures.toLocaleString()}
          </div>
          <p className="text-xs text-white/60 uppercase tracking-wider">Signatures</p>
        </div>
        <div className="bg-white/5 border border-white/10 p-4" style={{ borderRadius: 0 }}>
          <div className="text-2xl font-bold text-[#14F195] mb-1">
            {walletData.statistics.sol.toLocaleString()}
          </div>
          <p className="text-xs text-white/60 uppercase tracking-wider">SOL</p>
        </div>
        <div className="bg-white/5 border border-white/10 p-4" style={{ borderRadius: 0 }}>
          <div className="text-2xl font-bold bg-gradient-to-r from-[#FF5C1A] via-[#FF223B] to-[#30080C] bg-clip-text text-transparent mb-1">
            {walletData.statistics.nfts}
          </div>
          <p className="text-xs text-white/60 uppercase tracking-wider">NFTs</p>
        </div>
        <div className="bg-white/5 border border-white/10 p-4" style={{ borderRadius: 0 }}>
          <div className="text-2xl font-bold bg-gradient-to-r from-[#FF5C1A] via-[#FF223B] to-[#30080C] bg-clip-text text-transparent mb-1">
            {walletData.statistics.tokens}
          </div>
          <p className="text-xs text-white/60 uppercase tracking-wider">Tokens</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveTab("pnl")}
          className={`px-4 py-2 text-sm font-medium transition-all whitespace-nowrap ${
            activeTab === "pnl"
              ? "bg-gradient-to-r from-[#FF5C1A] via-[#FF223B] to-[#30080C] text-white"
              : "bg-white/5 text-white/60 hover:text-white"
          }`}
          style={{ borderRadius: 0 }}
        >
          PnL & ATH
        </button>
        <button
          onClick={() => setActiveTab("transactions")}
          className={`px-4 py-2 text-sm font-medium transition-all whitespace-nowrap ${
            activeTab === "transactions"
              ? "bg-gradient-to-r from-[#FF5C1A] via-[#FF223B] to-[#30080C] text-white"
              : "bg-white/5 text-white/60 hover:text-white"
          }`}
          style={{ borderRadius: 0 }}
        >
          Transactions
        </button>
        <button
          onClick={() => setActiveTab("nfts")}
          className={`px-4 py-2 text-sm font-medium transition-all whitespace-nowrap ${
            activeTab === "nfts"
              ? "bg-gradient-to-r from-[#FF5C1A] via-[#FF223B] to-[#30080C] text-white"
              : "bg-white/5 text-white/60 hover:text-white"
          }`}
          style={{ borderRadius: 0 }}
        >
          NFTs
        </button>
        <button
          onClick={() => setActiveTab("tokens")}
          className={`px-4 py-2 text-sm font-medium transition-all whitespace-nowrap ${
            activeTab === "tokens"
              ? "bg-gradient-to-r from-[#FF5C1A] via-[#FF223B] to-[#30080C] text-white"
              : "bg-white/5 text-white/60 hover:text-white"
          }`}
          style={{ borderRadius: 0 }}
        >
          Tokens SPL
        </button>
      </div>

      {/* Totals Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white/5 border border-white/10 p-4" style={{ borderRadius: 0 }}>
          <div className="flex items-center gap-2 mb-2">
            <Wallet className="w-4 h-4 text-[#FFB800]" />
            <p className="text-xs text-white/60 uppercase tracking-wider">Total Volume</p>
          </div>
          <p className="text-xl font-bold text-white">{walletData.totals.volumeTotal.toFixed(3)} SOL</p>
        </div>
        <div className="bg-white/5 border border-white/10 p-4" style={{ borderRadius: 0 }}>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-[#14F195]" />
            <p className="text-xs text-white/60 uppercase tracking-wider">Total PnL</p>
          </div>
          <p className="text-xl font-bold text-[#14F195]">{walletData.totals.pnlTotal.toFixed(3)} SOL</p>
        </div>
        <div className="bg-white/5 border border-white/10 p-4" style={{ borderRadius: 0 }}>
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-[#FF223B]" />
            <p className="text-xs text-white/60 uppercase tracking-wider">Success Rate</p>
          </div>
          <p className="text-xl font-bold text-white">{walletData.totals.successRate}%</p>
        </div>
        <div className="bg-white/5 border border-white/10 p-4" style={{ borderRadius: 0 }}>
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-[#FFB800]" />
            <p className="text-xs text-white/60 uppercase tracking-wider">Tokens Analyzed</p>
          </div>
          <p className="text-xl font-bold text-white">{walletData.totals.tokensAnalyzed}</p>
        </div>
      </div>

      {/* Distribution & Performance */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Token Distribution */}
        <div className="bg-white/5 border border-white/10 p-6" style={{ borderRadius: 0 }}>
          <h3 className="text-lg font-bold mb-4">Token Distribution</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-white/80">In Profit</span>
              <span className="text-[#14F195] font-bold">{walletData.distribution.inProfit.count} ({walletData.distribution.inProfit.percentage}%)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/80">In Loss</span>
              <span className="text-[#FF223B] font-bold">{walletData.distribution.inLoss.count} ({walletData.distribution.inLoss.percentage}%)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/80">Fully Sold</span>
              <span className="text-white/60 font-bold">{walletData.distribution.fullySold.count}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/80">Still Held</span>
              <span className="text-white/60 font-bold">{walletData.distribution.stillHeld.count}</span>
            </div>
          </div>
        </div>

        {/* Performance */}
        <div className="space-y-4">
          {/* Best Performer */}
          <div className="bg-gradient-to-r from-[#14F195]/10 to-transparent border border-[#14F195]/20 p-6" style={{ borderRadius: 0 }}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-[#14F195] flex items-center justify-center" style={{ borderRadius: 0 }}>
                <TrendingUp className="w-5 h-5 text-black" />
              </div>
              <h3 className="text-lg font-bold">Best Performer</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-white/60">Token</span>
                <span className="text-white font-mono">{walletData.bestPerformer.token}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">PnL</span>
                <span className="text-[#14F195] font-bold">{walletData.bestPerformer.pnl.toFixed(3)} SOL</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Volume</span>
                <span className="text-white">{walletData.bestPerformer.volume.toFixed(3)} SOL</span>
              </div>
            </div>
          </div>

          {/* Worst Performer */}
          <div className="bg-gradient-to-r from-[#FF223B]/10 to-transparent border border-[#FF223B]/20 p-6" style={{ borderRadius: 0 }}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-[#FF223B] flex items-center justify-center" style={{ borderRadius: 0 }}>
                <TrendingDown className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold">Worst Performer</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-white/60">Token</span>
                <span className="text-white font-mono">{walletData.worstPerformer.token}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">PnL</span>
                <span className="text-[#FF223B] font-bold">{walletData.worstPerformer.pnl.toFixed(4)} SOL</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Volume</span>
                <span className="text-white">{walletData.worstPerformer.volume.toFixed(3)} SOL</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        <button
          onClick={() => setFilterTab("all")}
          className={`px-4 py-2 text-sm font-medium transition-all whitespace-nowrap ${
            filterTab === "all"
              ? "bg-gradient-to-r from-[#FF5C1A] via-[#FF223B] to-[#30080C] text-white"
              : "bg-white/5 text-white/60 hover:text-white"
          }`}
          style={{ borderRadius: 0 }}
        >
          All
        </button>
        <button
          onClick={() => setFilterTab("profit")}
          className={`px-4 py-2 text-sm font-medium transition-all whitespace-nowrap ${
            filterTab === "profit"
              ? "bg-gradient-to-r from-[#FF5C1A] via-[#FF223B] to-[#30080C] text-white"
              : "bg-white/5 text-white/60 hover:text-white"
          }`}
          style={{ borderRadius: 0 }}
        >
          Profit
        </button>
        <button
          onClick={() => setFilterTab("loss")}
          className={`px-4 py-2 text-sm font-medium transition-all whitespace-nowrap ${
            filterTab === "loss"
              ? "bg-gradient-to-r from-[#FF5C1A] via-[#FF223B] to-[#30080C] text-white"
              : "bg-white/5 text-white/60 hover:text-white"
          }`}
          style={{ borderRadius: 0 }}
        >
          Loss
        </button>
        <button
          onClick={() => setFilterTab("held")}
          className={`px-4 py-2 text-sm font-medium transition-all whitespace-nowrap ${
            filterTab === "held"
              ? "bg-gradient-to-r from-[#FF5C1A] via-[#FF223B] to-[#30080C] text-white"
              : "bg-white/5 text-white/60 hover:text-white"
          }`}
          style={{ borderRadius: 0 }}
        >
          Held
        </button>
        <button
          onClick={() => setFilterTab("sold")}
          className={`px-4 py-2 text-sm font-medium transition-all whitespace-nowrap ${
            filterTab === "sold"
              ? "bg-gradient-to-r from-[#FF5C1A] via-[#FF223B] to-[#30080C] text-white"
              : "bg-white/5 text-white/60 hover:text-white"
          }`}
          style={{ borderRadius: 0 }}
        >
          Sold
        </button>
      </div>

      {/* Token Details */}
      <div>
        <h3 className="text-lg font-bold mb-4">Token Details ({filteredTokens.length})</h3>
        <div className="space-y-4">
          {filteredTokens.map((token, index) => (
            <div key={index} className="bg-white/5 border border-white/10 p-6 hover:bg-white/10 transition-colors" style={{ borderRadius: 0 }}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 bg-gradient-to-r from-[#FF5C1A] via-[#FF223B] to-[#30080C] flex items-center justify-center font-bold text-white text-sm" style={{ borderRadius: 0 }}>
                      {token.ticker.substring(0, 2)}
                    </div>
                    <h4 className="text-lg font-bold">{token.name}</h4>
                  </div>
                  <p className="text-xs text-white/40 font-mono">{token.address}</p>
                  <div className="flex gap-2 mt-2">
                    {token.badges.map((badge, i) => (
                      <span
                        key={i}
                        className={`px-2 py-1 text-xs font-bold ${
                          badge === "Profit"
                            ? "bg-[#14F195]/20 text-[#14F195]"
                            : badge === "Loss"
                            ? "bg-[#FF223B]/20 text-[#FF223B]"
                            : "bg-white/10 text-white/60"
                        }`}
                        style={{ borderRadius: 0 }}
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-2xl font-bold ${token.pnlRealized >= 0 ? "text-[#14F195]" : "text-[#FF223B]"}`}>
                    {token.pnlRealized >= 0 ? "+" : ""}{token.pnlRealized.toFixed(4)} SOL
                  </p>
                  <p className="text-xs text-white/40">{token.transactions} transactions</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-white/60 mb-1">Volume Total</p>
                  <p className="text-white font-bold">{token.volumeTotal.toFixed(3)} SOL</p>
                </div>
                <div>
                  <p className="text-xs text-white/60 mb-1">PnL Realized</p>
                  <p className={`font-bold ${token.pnlRealized >= 0 ? "text-[#14F195]" : "text-[#FF223B]"}`}>
                    {token.pnlRealized.toFixed(4)} SOL
                  </p>
                </div>
                <div>
                  <p className="text-xs text-white/60 mb-1">Tokens Held</p>
                  <p className="text-white font-bold">{token.tokensHeld.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-white/60 mb-1">ATH</p>
                  <p className="text-white font-bold">{token.ath.toFixed(6)} SOL</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}