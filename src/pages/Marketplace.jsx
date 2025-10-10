
import React from "react";
import { ArrowLeft, Crown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import SponsoredSlot from "../components/marketplace/SponsoredSlot";
import CategorySection from "../components/marketplace/CategorySection";

const sponsoredSlots = [
  {
    name: "Jupiter Agent",
    avatar: "🪐",
    description: "Your DeFi trading companion with advanced swap strategies",
    currentBid: 15.5,
    tags: ["DEX", "Trading", "Active"]
  },
  {
    name: "Spartan AI",
    avatar: "⚔️",
    description: "Warrior-grade portfolio management and risk analysis",
    currentBid: 12.3,
    tags: ["Portfolio", "Risk", "Premium"]
  },
  {
    name: "AskJimmy",
    avatar: "🎯",
    description: "Smart research assistant for crypto fundamentals",
    currentBid: 8.7,
    tags: ["Research", "Analytics", "Trending"]
  }
];

const categories = [
  {
    title: "Trading and Portfolio Optimization",
    agents: [
      {
        name: "Various Agents",
        avatar: "📊",
        price: 1,
        description: "Offering quantitative trading strategies",
        tags: ["Store Trading", "ElizaOS Wiki", "Active Agent"]
      },
      {
        name: "Trading System",
        avatar: "📈",
        price: 0.5,
        description: "Hybrid trading system using AI layers and web3",
        tags: ["Store Trading", "ElizaOS Wiki", "Active Agent"]
      },
      {
        name: "Custom Trading",
        avatar: "⚡",
        price: 0.1,
        description: "Supports custom trading agents on Raydium and Backpack Exchange",
        tags: ["Store Trading", "ElizaOS Wiki", "Active Agent"]
      }
    ]
  },
  {
    title: "Liquidity Provisioning Agents",
    agents: [
      {
        name: "Stabilization Agent",
        avatar: "💧",
        price: 1,
        description: "Stabilization yield agent",
        tags: ["Store Trading", "ElizaOS Wiki", "Active Agent"]
      },
      {
        name: "Market Making",
        avatar: "🎯",
        price: 3,
        description: "Market making agents",
        tags: ["Store Trading", "ElizaOS Wiki", "Active Agent"]
      },
      {
        name: "Auto-Rebalancing",
        avatar: "⚖️",
        price: 5,
        description: "Provides auto-rebalancing for 50/50 LP positions",
        tags: ["Store Trading", "ElizaOS Wiki", "Active Agent"]
      }
    ]
  },
  {
    title: "Lending Agents",
    agents: [
      {
        name: "Best Lending",
        avatar: "💰",
        price: 1,
        description: "Finds the best lending protocols, laundry pools and delegated yield strategies",
        tags: ["Store Trading", "ElizaOS Wiki", "Active Agent"]
      },
      {
        name: "Lending Service",
        avatar: "🏦",
        price: 2,
        description: "Lending and borrowing across all major protocols",
        tags: ["Store Trading", "ElizaOS Wiki", "Active Agent"]
      },
      {
        name: "Personalized Yield",
        avatar: "✨",
        price: 0.2,
        description: "A personalized 'lazy' agent for the laziest risk-adjusted yield seekers",
        tags: ["Store Trading", "ElizaOS Wiki", "Active Agent"]
      }
    ]
  },
  {
    title: "Prediction and Betting Agents",
    agents: [
      {
        name: "Sports Betting",
        avatar: "🎲",
        price: 1,
        description: "Active in crypto-themed sports books and prediction markets",
        tags: ["Store Trading", "ElizaOS Wiki", "Active Agent"]
      },
      {
        name: "Automated Trading",
        avatar: "🤖",
        price: 1,
        description: "Provides analysis and bets automated trading options for independent",
        tags: ["Store Trading", "ElizaOS Wiki", "Active Agent"]
      }
    ]
  },
  {
    title: "Analytics & Research Agents",
    agents: [
      {
        name: "Market Intelligence",
        avatar: "🔍",
        price: 10,
        description: "Crypto market intelligence, real-time detection of on-chain anomalies, KOL Grading",
        tags: ["Store Trading", "ElizaOS Wiki", "Active Agent"]
      },
      {
        name: "Fundamental Analysis",
        avatar: "📚",
        price: 0.5,
        description: "Delivering initial research for any emerging you name, powered by Arbius's Mixtral and on OpenAI APIs",
        tags: ["Store Trading", "ElizaOS Wiki", "Active Agent"]
      }
    ]
  },
  {
    title: "Early-Stage & Innovative Agents",
    agents: [
      {
        name: "Yield Terminal",
        avatar: "🌱",
        price: 1,
        description: "An interactive terminal that provides yield strategies and research",
        tags: ["Store Trading", "ElizaOS Wiki", "Active Agent"]
      },
      {
        name: "DeFi Ecosystem",
        avatar: "🚀",
        price: 1,
        description: "Developing various high-quality DeFi agents for their ecosystem",
        tags: ["Store Trading", "ElizaOS Wiki", "Active Agent"]
      }
    ]
  }
];

export default function Marketplace() {
  return (
    <>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-12">
        {/* Main Layout: Sponsored Left + Content Right */}
        <div className="grid lg:grid-cols-[350px_1fr] gap-8">
          {/* Left Sidebar - Sponsored Slots */}
          <div className="space-y-6">
            <div className="sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Crown className="w-5 h-5 text-[#FFD700]" />
                  <span className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent">
                    Sponsored
                  </span>
                </h2>
                <Button size="sm" className="bg-white/10 hover:bg-white/20 text-white border-none" style={{ borderRadius: 0 }}>
                  <Sparkles className="w-3 h-3 mr-1" />
                  Bid
                </Button>
              </div>
              
              <p className="text-white/60 text-xs mb-6">
                Premium visibility through auction
              </p>

              <div className="space-y-4">
                {sponsoredSlots.map((slot, index) => (
                  <SponsoredSlot key={index} slot={slot} rank={index + 1} />
                ))}
              </div>

              {/* Auction Info */}
              <div className="mt-6 bg-white/5 border border-white/10 p-4" style={{ borderRadius: 0 }}>
                <h3 className="text-sm font-bold mb-2 text-white">Auction Info</h3>
                <div className="space-y-2 text-xs text-white/60">
                  <p>• Bids renew every 24h</p>
                  <p>• Smart contract secured</p>
                  <p>• Instant visibility boost</p>
                </div>
                <Button 
                  className="w-full mt-4 bg-gradient-to-r from-[#FF5C1A] via-[#FF223B] to-[#30080C] h-8 text-xs hover:shadow-lg hover:shadow-[#FF5C1A]/50" 
                  style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%)', borderRadius: 0 }}
                >
                  Learn More
                </Button>
              </div>
            </div>
          </div>

          {/* Right Content - Title + Categories */}
          <div>
            {/* Hero Title - Aligned Left */}
            <div className="mb-12">
              <h1 
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
                style={{ fontFamily: 'TECHNOS, sans-serif' }}
              >
                PLUGIN{" "}
                <span className="bg-gradient-to-r from-[#FF5C1A] via-[#FF223B] to-[#30080C] bg-clip-text text-transparent">
                  MARKETPLACE
                </span>
              </h1>
              <p className="text-lg text-white/60">
                Discover and deploy powerful AI plugins for crypto trading, research, and automation
              </p>
            </div>

            {/* Categories */}
            {categories.map((category, index) => (
              <CategorySection key={index} title={category.title} agents={category.agents} />
            ))}

            {/* Footer CTA */}
            <div className="mt-16 text-center bg-gradient-to-r from-[#FF5C1A]/10 via-[#FF223B]/10 to-[#30080C]/10 border border-[#FF5C1A]/30 p-8" style={{ borderRadius: 0 }}>
              <h3 className="text-2xl font-bold mb-4">Want to list your plugin?</h3>
              <p className="text-white/60 mb-6">
                Join the marketplace and reach thousands of crypto enthusiasts
              </p>
              <Button 
                className="bg-gradient-to-r from-[#FF5C1A] via-[#FF223B] to-[#30080C] hover:shadow-lg hover:shadow-[#FF5C1A]/50" 
                style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)', borderRadius: 0 }}
              >
                Submit Your Plugin
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
