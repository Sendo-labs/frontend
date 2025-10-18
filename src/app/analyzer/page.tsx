"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, TrendingDown, Share2, Zap, MessageCircle, Crown, Wallet, Activity, Image as ImageIcon, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface WalletAnalysisResult {
  wallet: string;
  total_missed_usd: number;
  stats: {
    signatures: number;
    sol_balance: number;
    nfts: number;
    tokens: number;
  };
  performance: {
    total_volume_sol: number;
    total_pnl_sol: number;
    success_rate: number;
    tokens_analyzed: number;
  };
  distribution: {
    in_profit: number;
    in_loss: number;
    fully_sold: number;
    still_held: number;
  };
  best_performer: {
    token: string;
    symbol: string;
    pnl_sol: number;
    volume_sol: number;
  };
  worst_performer: {
    token: string;
    symbol: string;
    pnl_sol: number;
    volume_sol: number;
  };
  tokens: Array<{
    symbol: string;
    token_address: string;
    missed_usd: number;
    ath_price: number;
    sold_price: number;
    ath_change_pct: number;
    volume_sol: number;
    pnl_sol: number;
    tokens_held: number;
    transactions: number;
    status: string;
    profit_status: string;
  }>;
  rank: string;
  punchline: string;
}

export default function AnalyzerPage() {
  const searchParams = useSearchParams();
  const [wallet, setWallet] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<WalletAnalysisResult | null>(null);

  useEffect(() => {
    const walletParam = searchParams.get('wallet');
    
    if (walletParam && walletParam.trim()) {
      setWallet(walletParam);
      setTimeout(() => {
        handleAnalyze(walletParam);
      }, 500);
    }
  }, [searchParams]);

  const handleAnalyze = async (walletAddress = wallet) => {
    if (!walletAddress.trim()) return;
    
    setIsAnalyzing(true);
    
    // Mock data - Replace with actual API call
    setTimeout(() => {
      setResult({
        wallet: walletAddress,
        total_missed_usd: 847393,
        stats: {
          signatures: 2847,
          sol_balance: 1551.82,
          nfts: 2,
          tokens: 47
        },
        performance: {
          total_volume_sol: 22.444,
          total_pnl_sol: 11.692,
          success_rate: 50,
          tokens_analyzed: 6
        },
        distribution: {
          in_profit: 3,
          in_loss: 2,
          fully_sold: 0,
          still_held: 2
        },
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
          }
        ],
        rank: "CERTIFIED BAGHOLDER 💀",
        punchline: "Top 0.1% of Pain"
      });
      setIsAnalyzing(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 md:mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
            WALLET ANALYZER
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Analyze your trading performance and discover missed opportunities
          </p>
        </motion.div>

        {/* Search Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl mx-auto mb-16"
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Enter Solana wallet address..."
                  value={wallet}
                  onChange={(e) => setWallet(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAnalyze()}
                  className="flex-1"
                />
                <Button 
                  onClick={() => handleAnalyze()}
                  disabled={isAnalyzing || !wallet.trim()}
                >
                  {isAnalyzing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      Analyze
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Results */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              {/* Hero Card */}
              <Card className="border-destructive">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-3xl font-bold">
                      ${result.total_missed_usd.toLocaleString()}
                    </CardTitle>
                    <span className="text-sm text-muted-foreground">
                      Total Missed Value
                    </span>
                  </div>
                  <CardDescription className="text-xl">
                    {result.rank}
                  </CardDescription>
                </CardHeader>
              </Card>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <Activity className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Signatures</p>
                        <p className="text-2xl font-bold">{result.stats.signatures}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <Wallet className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">SOL Balance</p>
                        <p className="text-2xl font-bold">{result.stats.sol_balance}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <ImageIcon className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">NFTs</p>
                        <p className="text-2xl font-bold">{result.stats.nfts}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <Coins className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Tokens</p>
                        <p className="text-2xl font-bold">{result.stats.tokens}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Token List */}
              <Card>
                <CardHeader>
                  <CardTitle>Token Analysis</CardTitle>
                  <CardDescription>Detailed breakdown of your trading history</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {result.tokens.map((token, index) => (
                      <div 
                        key={index}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold">
                            {token.symbol.substring(0, 2)}
                          </div>
                          <div>
                            <p className="font-semibold">{token.symbol}</p>
                            <p className="text-sm text-muted-foreground">
                              {token.token_address.substring(0, 8)}...
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-bold ${token.profit_status === 'profit' ? 'text-green-500' : 'text-destructive'}`}>
                            {token.pnl_sol > 0 ? '+' : ''}{token.pnl_sol.toFixed(4)} SOL
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Missed: ${token.missed_usd.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
