import React from "react";
import { motion } from "framer-motion";
import { PieChart } from "lucide-react";

export default function TokenDistribution({ distribution }) {
  const items = [
    { label: "In Profit", value: distribution.in_profit, color: "text-[#14F195]", pct: 50 },
    { label: "In Loss", value: distribution.in_loss, color: "text-[#FF223B]", pct: 33.3 },
    { label: "Fully Sold", value: distribution.fully_sold, color: "text-[#F2EDE7]", pct: 0 },
    { label: "Still Held", value: distribution.still_held, color: "text-[#FF6B00]", pct: 16.7 }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4, duration: 0.6 }}
      className="bg-[#0D0D0D] border border-[#F2EDE7]/10 p-6"
      style={{ borderRadius: 0 }}
    >
      <div className="flex items-center gap-2 mb-6">
        <PieChart className="w-5 h-5 text-[#FF6B00]" />
        <h3 className="text-lg font-bold text-[#F2EDE7] uppercase" style={{ fontFamily: 'TECHNOS, sans-serif' }}>
          TOKEN DISTRIBUTION
        </h3>
      </div>

      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <span className="text-[#F2EDE7]/70 text-sm">{item.label}</span>
            <div className="flex items-center gap-3">
              <span className={`font-bold text-lg ${item.color}`} style={{ fontFamily: 'TECHNOS, sans-serif' }}>
                {item.value}
              </span>
              <span className="text-[#F2EDE7]/40 text-xs w-12 text-right">
                {item.pct > 0 ? `(${item.pct}%)` : ''}
              </span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}