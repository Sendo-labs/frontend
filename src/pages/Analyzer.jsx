import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, TrendingDown, Share2, Zap, MessageCircle, Crown, Wallet, Activity, Image as ImageIcon, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";

import WalletInput from "../components/analyzer/WalletInput";
import ResultHeroCard from "../components/analyzer/ResultHeroCard";
import WalletStatsGrid from "../components/analyzer/WalletStatsGrid";
import PerformanceMetrics from "../components/analyzer/PerformanceMetrics";
import TokenDistribution from "../components/analyzer/TokenDistribution";
import BestWorstPerformers from "../components/analyzer/BestWorstPerformers";
import TokenDetailsList from "../components/analyzer/TokenDetailsList";
import MiniChartATH from "../components/analyzer/MiniChartATH";
import ShareButtons from "../components/analyzer/ShareButtons";
import CTAActivateWorker from "../components/analyzer/CTAActivateWorker";

export default function Analyzer() {
  const [wallet, setWallet] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const walletParam = searchParams.get('wallet');
    
    if (walletParam && walletParam.trim()) {
      setWallet(walletParam);
      setTimeout(() => {
        handleAnalyze(walletParam);
      }, 500);
    }
  }, [location.search]);

  const handleAnalyze = async (walletAddress = wallet) => {
    if (!walletAddress.trim()) return;
    
    setIsAnalyzing(true);
    
    setTimeout(() => {
      setResult({
        wallet: walletAddress,
        total_missed_usd: 847393,
        
        // Wallet stats
        stats: {
          signatures: 2847,
          sol_balance: 1551.82,
          nfts: 2,
          tokens: 47
        },
        
        // Performance metrics
        performance: {
          total_volume_sol: 22.444,
          total_pnl_sol: 11.692,
          success_rate: 50,
          tokens_analyzed: 6
        },
        
        // Token distribution
        distribution: {
          in_profit: 3,
          in_loss: 2,
          fully_sold: 0,
          still_held: 2
        },
        
        // Top performers
        best_performer: {
          token: "5ZV3HcSD",
          symbol: "BONK",
          pnl_sol: 12.222,
          volume_sol: 14.932
        },
        worst_performer: {
          token: "7sSxTsqB",
          symbol: "WIF",
          pnl_sol: -8.4216,
          volume_sol: 1.734
        },
        
        // Top pain points
        tokens: [
          { 
            symbol: "BONK", 
            token_address: "5ZV3HcSD",
            missed_usd: 234568, 
            ath_price: 0.00000045,
            sold_price: 0.000000012,
            ath_change_pct: -92,
            volume_sol: 14.932,
            pnl_sol: 12.222,
            tokens_held: 0,
            transactions: 8,
            status: "sold",
            profit_status: "profit"
          },
          { 
            symbol: "WIF", 
            token_address: "7sSxTsqB",
            missed_usd: 189234, 
            ath_price: 3.45,
            sold_price: 0.89,
            ath_change_pct: -85,
            volume_sol: 1.734,
            pnl_sol: -8.4216,
            tokens_held: 0,
            transactions: 3,
            status: "sold",
            profit_status: "loss"
          },
          { 
            symbol: "SAMO", 
            token_address: "Bg34H2jy",
            missed_usd: 156789, 
            ath_price: 0.234,
            sold_price: 0.067,
            ath_change_pct: -78,
            volume_sol: 1.485,
            pnl_sol: 0.0566,
            tokens_held: 0,
            transactions: 2,
            status: "sold",
            profit_status: "profit"
          },
          {
            symbol: "PUMP",
            token_address: "7hpxmtJ1",
            missed_usd: 98420,
            ath_price: 0.00000089,
            sold_price: 0,
            ath_change_pct: -91,
            volume_sol: 0.925,
            pnl_sol: -0.2251,
            tokens_held: 15535577.16,
            transactions: 1,
            status: "holding",
            profit_status: "loss"
          },
          {
            symbol: "DEGEN",
            token_address: "LHywvDs4",
            missed_usd: 67234,
            ath_price: 0.045,
            sold_price: 0,
            ath_change_pct: -86,
            volume_sol: 0.518,
            pnl_sol: -0.2987,
            tokens_held: 8923456.22,
            transactions: 1,
            status: "holding",
            profit_status: "loss"
          },
          {
            symbol: "MEW",
            token_address: "oXMtQ4uCv",
            missed_usd: 45120,
            ath_price: 0.0012,
            sold_price: 0.00089,
            ath_change_pct: -74,
            volume_sol: 0.518,
            pnl_sol: 0.1334,
            tokens_held: 0,
            transactions: 3,
            status: "sold",
            profit_status: "profit"
          }
        ],
        
        rank: "CERTIFIED BAGHOLDER 💀",
        punchline: "Top 0.1% of Pain",
        
        mini_chart: {
          points: [
            [0, 1.0],
            [1, 0.8],
            [2, 0.6],
            [3, 0.4],
            [4, 0.3],
            [5, 0.2]
          ]
        }
      });
      setIsAnalyzing(false);
    }, 2000);
  };

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
            WALLET{" "}
            <span className="bg-gradient-to-r from-[#FF6B00] to-[#FF223B] bg-clip-text text-transparent">
              ANALYZER
            </span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-[#F2EDE7]/60 max-w-3xl mx-auto">
            Analyze your pain 💀 See how much you lost by not selling at ATH
          </p>
        </motion.div>

        {/* Wallet Input */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <WalletInput
            wallet={wallet}
            setWallet={setWallet}
            onAnalyze={() => handleAnalyze()}
            isAnalyzing={isAnalyzing}
          />
        </motion.div>

        {/* Results */}
        <AnimatePresence mode="wait">
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.6 }}
              className="mt-12 md:mt-16 space-y-6 md:space-y-8"
            >
              {/* Hero Recap Card */}
              <ResultHeroCard result={result} />
              
              {/* Wallet Stats Grid */}
              <WalletStatsGrid stats={result.stats} />
              
              {/* Performance Metrics */}
              <PerformanceMetrics performance={result.performance} />
              
              {/* Token Distribution + Best/Worst Performers */}
              <div className="grid lg:grid-cols-2 gap-6">
                <TokenDistribution distribution={result.distribution} />
                <BestWorstPerformers 
                  best={result.best_performer} 
                  worst={result.worst_performer} 
                />
              </div>
              
              {/* Chart */}
              <MiniChartATH data={result.mini_chart} />
              
              {/* Token Details List */}
              <TokenDetailsList tokens={result.tokens} />
              
              {/* Actions */}
              <div className="grid md:grid-cols-2 gap-6">
                <ShareButtons result={result} />
                <CTAActivateWorker />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Leaderboard CTA */}
        {!result && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-16 text-center"
          >
            <Link to={createPageUrl("Leaderboard")}>
              <Button
                className="bg-[#F2EDE7]/5 border border-[#F2EDE7]/10 hover:bg-[#F2EDE7]/10 hover:border-[#FF223B]/50 text-[#F2EDE7] h-12 px-8 transition-all group"
                style={{ borderRadius: 0 }}
              >
                <Crown className="w-5 h-5 mr-2 text-[#FF6B00] group-hover:scale-110 transition-transform" />
                <span style={{ fontFamily: 'TECHNOS, sans-serif' }}>VIEW LEADERBOARD</span>
              </Button>
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}