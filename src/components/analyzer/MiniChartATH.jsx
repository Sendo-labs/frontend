import React from "react";
import { motion } from "framer-motion";
import { TrendingDown } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function MiniChartATH({ data }) {
  // Transform points into recharts format
  const chartData = data.points.map((point, index) => ({
    name: index === 0 ? 'ATH' : index === data.points.length - 1 ? 'Now' : `Day ${index}`,
    value: point[1] * 100, // Convert to percentage
    rawValue: point[1]
  }));

  const peakValue = 100000; // Mock peak value in USD
  const currentValue = peakValue * data.points[data.points.length - 1][1];
  const lossPercent = Math.round((1 - data.points[data.points.length - 1][1]) * 100);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#0D0D0D] border border-[#FF6B00]/30 p-3" style={{ borderRadius: 0 }}>
          <p className="text-[#F2EDE7] text-sm font-bold">{payload[0].payload.name}</p>
          <p className="text-[#FF6B00] text-xs">{payload[0].value.toFixed(1)}%</p>
          <p className="text-[#F2EDE7]/60 text-xs">
            ${(peakValue * payload[0].payload.rawValue / 1000).toFixed(1)}k
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="bg-[#F2EDE7]/5 border border-[#F2EDE7]/10 p-6 md:p-8 relative overflow-hidden group hover:border-[#FF6B00]/50 transition-all"
      style={{ borderRadius: 0 }}
    >
      <div className="flex items-center gap-2 mb-6">
        <TrendingDown className="w-5 h-5 text-[#FF223B]" />
        <h3 className="text-[#F2EDE7]/60 uppercase text-sm" style={{ fontFamily: 'TECHNOS, sans-serif' }}>
          VALUE FROM ATH TO NOW
        </h3>
      </div>

      <div className="h-48 md:h-64 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FF6B00" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#FF223B" stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F2EDE7" strokeOpacity={0.1} />
            <XAxis 
              dataKey="name" 
              stroke="#F2EDE7" 
              strokeOpacity={0.4}
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="#F2EDE7" 
              strokeOpacity={0.4}
              style={{ fontSize: '12px' }}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#FF223B" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorValue)" 
              animationDuration={2000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#F2EDE7]/10">
        <div>
          <p className="text-[#F2EDE7]/40 text-xs mb-1 uppercase" style={{ fontFamily: 'TECHNOS, sans-serif' }}>
            PEAK VALUE
          </p>
          <p className="text-[#F2EDE7] font-bold text-lg">
            ${(peakValue / 1000).toFixed(1)}k
          </p>
        </div>
        <div>
          <p className="text-[#F2EDE7]/40 text-xs mb-1 uppercase" style={{ fontFamily: 'TECHNOS, sans-serif' }}>
            CURRENT VALUE
          </p>
          <p className="text-[#F2EDE7] font-bold text-lg">
            ${(currentValue / 1000).toFixed(1)}k
          </p>
        </div>
        <div>
          <p className="text-[#F2EDE7]/40 text-xs mb-1 uppercase" style={{ fontFamily: 'TECHNOS, sans-serif' }}>
            % LOST
          </p>
          <p className="text-[#FF223B] font-bold text-lg">
            -{lossPercent}%
          </p>
        </div>
      </div>
    </motion.div>
  );
}