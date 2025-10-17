import React from "react";
import { motion } from "framer-motion";
import { Activity, Wallet, Image as ImageIcon, Coins } from "lucide-react";

export default function WalletStatsGrid({ stats }) {
  const statCards = [
    { icon: Activity, label: "SIGNATURES", value: stats.signatures.toLocaleString(), color: "from-[#FF6B00] to-[#FF223B]" },
    { icon: Wallet, label: "SOL", value: stats.sol_balance.toFixed(2), color: "from-[#14F195] to-[#00D9B5]" },
    { icon: ImageIcon, label: "NFTs", value: stats.nfts, color: "from-[#9945FF] to-[#14F195]" },
    { icon: Coins, label: "TOKENS", value: stats.tokens, color: "from-[#FF6B00] to-[#FF223B]" }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 * index, duration: 0.5 }}
          className="bg-[#0D0D0D] border border-[#F2EDE7]/10 p-6 hover:border-[#FF6B00]/50 transition-all"
          style={{ borderRadius: 0 }}
        >
          <div className={`w-10 h-10 bg-gradient-to-r ${stat.color} flex items-center justify-center mb-4`} style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%)' }}>
            <stat.icon className="w-5 h-5 text-white" />
          </div>
          <div className="text-3xl md:text-4xl font-bold text-[#F2EDE7] mb-1" style={{ fontFamily: 'TECHNOS, sans-serif' }}>
            {stat.value}
          </div>
          <div className="text-xs text-[#F2EDE7]/60 uppercase" style={{ fontFamily: 'TECHNOS, sans-serif' }}>
            {stat.label}
          </div>
        </motion.div>
      ))}
    </div>
  );
}