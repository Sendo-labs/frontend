"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Medal, Award } from "lucide-react";

export default function LeaderboardPage() {
  const topTraders = [
    { rank: 1, name: "CryptoKing", pnl: 125000, trades: 450 },
    { rank: 2, name: "SolanaWhale", pnl: 98000, trades: 380 },
    { rank: 3, name: "DiamondHands", pnl: 87000, trades: 320 },
    { rank: 4, name: "TokenMaster", pnl: 76000, trades: 290 },
    { rank: 5, name: "MoonShooter", pnl: 65000, trades: 250 }
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 2: return <Medal className="w-6 h-6 text-gray-400" />;
      case 3: return <Award className="w-6 h-6 text-amber-700" />;
      default: return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
            LEADERBOARD
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Top performers in the SENDO ecosystem
          </p>
        </div>

        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Top Traders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topTraders.map((trader) => (
                <div 
                  key={trader.rank}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 flex justify-center">
                      {getRankIcon(trader.rank)}
                    </div>
                    <div>
                      <p className="font-semibold">{trader.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {trader.trades} trades
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-green-500">
                      +${trader.pnl.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">PnL</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
