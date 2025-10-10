
import React, { useState, useEffect } from "react";
import { X, Loader2, TrendingUp, TrendingDown, Bot, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";

const recommendedAgents = [
  {
    id: "spartan",
    name: "Spartan AI",
    avatar: "⚔️",
    description: "For memecoin trading and stop-loss strategies to prevent your bag from going to zero if you want to stay active in this space.",
    reason: "You're holding high-risk memecoin positions",
    match: 95
  },
  {
    id: "jito",
    name: "Jito Plugin", // Changed from Agent to Plugin
    avatar: "💎",
    description: "To stake your Solana and earn interest.",
    reason: "You have idle SOL that could be earning yield",
    match: 88
  },
  {
    id: "swarm",
    name: "The Swarm (Jupiter, Raydium, Meteora, and Orca)",
    avatar: "🐝",
    description: "To explore placing your tokens in liquidity pools.",
    reason: "You've generated yield opportunities",
    match: 75
  },
  {
    id: "hyperliquid",
    name: "Hyperliquid Plugin", // Changed from Agent to Plugin
    avatar: "⚡",
    description: "To use advanced strategies for short or long positions in the market.",
    reason: "Your trading patterns show interest in leverage",
    match: 82
  }
];

export default function WalletAnalysisModal({ isOpen, onClose, walletAddress: initialWallet, onSelectAgent }) {
  const [step, setStep] = useState(1);
  const [walletAddress, setWalletAddress] = useState(initialWallet || "");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);

  useEffect(() => {
    if (initialWallet) {
      setWalletAddress(initialWallet);
      
      // Auto-analyze if wallet provided
      const analyze = async () => {
        setIsAnalyzing(true);
        setStep(2);
        await new Promise(resolve => setTimeout(resolve, 3000));
        setIsAnalyzing(false);
        setAnalysisComplete(true);
        setStep(3);
      };
      
      analyze();
    }
  }, [initialWallet]);

  const handleAnalyze = async () => {
    if (!walletAddress.trim()) return;
    
    setIsAnalyzing(true);
    setStep(2);

    // Simulate analysis
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setIsAnalyzing(false);
    setAnalysisComplete(true);
    setStep(3);
  };

  const handleSelectAgent = (agent) => {
    onSelectAgent({
      id: agent.id,
      name: agent.name,
      description: agent.description,
      avatar: agent.avatar,
      active: true
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-[#0A0A0A] border-2 border-[#FF5C1A]/30 p-0 overflow-hidden" style={{ borderRadius: 0 }}>
        <div className="relative p-8">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
            style={{ borderRadius: 0 }}
          >
            <X className="w-5 h-5 text-white" />
          </button>

          {/* Step 1: Wallet Input */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="w-20 h-20 bg-gradient-to-r from-[#FF5C1A] via-[#FF223B] to-[#30080C] flex items-center justify-center mx-auto mb-6" style={{ borderRadius: 0 }}>
                <Bot className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">
                Let's Find Your Perfect Plugin
              </h2>
              <p className="text-white/60 mb-8">
                Enter your Solana wallet address to analyze your trading history and get personalized plugin recommendations
              </p>

              <div className="max-w-md mx-auto">
                <Input
                  type="text"
                  placeholder="Enter your Solana wallet..."
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  className="h-14 text-lg bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-[#FF5C1A] transition-all mb-4"
                  style={{ borderRadius: 0 }}
                />
                <Button
                  onClick={handleAnalyze}
                  disabled={!walletAddress.trim()}
                  className="w-full h-14 text-lg font-bold bg-gradient-to-r from-[#FF5C1A] via-[#FF223B] to-[#30080C] hover:shadow-lg hover:shadow-[#FF5C1A]/50 transition-all"
                  style={{ borderRadius: 0 }}
                >
                  Analyze Wallet
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Analyzing */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <Loader2 className="w-16 h-16 text-[#FF5C1A] animate-spin mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-white mb-4">
                Analyzing Your Trading History
              </h2>
              <div className="space-y-2 text-white/60">
                <p>📊 Scanning transactions...</p>
                <p>💹 Analyzing profit & loss patterns...</p>
                <p>🎯 Identifying opportunities...</p>
                <p>🤖 Matching with best agents...</p>
              </div>
            </motion.div>
          )}

          {/* Step 3: Recommendations */}
          {step === 3 && analysisComplete && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">
                  We recommend connecting with <span className="text-[#FF5C1A]">4 of our Plugins</span>
                </h2>
                <p className="text-white/60">
                  Based on your 2-year trading history on Solana
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 p-6 mb-6" style={{ borderRadius: 0 }}>
                <p className="text-white/80 text-sm leading-relaxed">
                  We analyzed your trading history and found that you've been trading on Solana for 2 years. 
                  We detected that you are holding some memecoin positions that eventually went to zero because you didn't sell in time. 
                  You've also held Solana for over a year without putting it into protocols that could have generated yield, 
                  and you still held tokens that could have been placed in liquidity pools to earn fees.
                </p>
              </div>

              <div className="grid gap-4">
                {recommendedAgents.map((agent, index) => (
                  <motion.div
                    key={agent.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/5 border border-white/10 p-4 hover:bg-white/10 hover:border-[#FF5C1A]/50 transition-all group cursor-pointer"
                    onClick={() => handleSelectAgent(agent)}
                    style={{ borderRadius: 0 }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-[#FF5C1A] via-[#FF223B] to-[#30080C] flex items-center justify-center text-xl flex-shrink-0" style={{ borderRadius: 0 }}>
                        {agent.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-white font-bold">{agent.name}</h3>
                          <div className="flex items-center gap-1">
                            <div className="text-[#14F195] text-sm font-bold">{agent.match}%</div>
                            <div className="text-white/40 text-xs">match</div>
                          </div>
                        </div>
                        <p className="text-white/70 text-sm mb-2">{agent.description}</p>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-3 h-3 text-[#14F195]" />
                          <p className="text-white/50 text-xs italic">{agent.reason}</p>
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-white/40 group-hover:text-[#FF5C1A] group-hover:translate-x-1 transition-all flex-shrink-0" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
