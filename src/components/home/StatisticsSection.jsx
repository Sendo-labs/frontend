
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, TrendingDown, DollarSign, Wallet } from "lucide-react";

const stats = [
  { icon: Wallet, label: "WALLETS SCANNED", value: 12847, format: "number" },
  { icon: DollarSign, label: "TOTAL ATH MISSED", value: 247893421, format: "currency" },
  { icon: TrendingDown, label: "AVERAGE LOSS", value: 19287, format: "currency" },
  { icon: Users, label: "BROKEN HEARTS", value: 12847, format: "number" }
];

function formatNumber(num, format) {
  if (format === "currency") {
    if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `$${(num / 1000).toFixed(0)}k`;
    }
    return `$${num.toLocaleString()}`;
  }
  
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(0)}k`;
  }
  return num.toLocaleString();
}

function CountUp({ end, duration = 2, format = "number" }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = (timestamp - startTime) / (duration * 1000);

      if (progress < 1) {
        setCount(Math.floor(end * progress));
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return <span>{formatNumber(count, format)}</span>;
}

export default function StatisticsSection() {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center bg-[#0D0D0D] py-16 md:py-0 overflow-hidden">
      <div className="max-w-[1400px] mx-auto w-full px-4 sm:px-6">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-3 sm:mb-4 md:mb-6 text-[#F2EDE7]"
          style={{ fontFamily: 'TECHNOS, sans-serif' }}
        >
          THE{" "}
          <span className="bg-gradient-to-r from-[#FF6B00] to-[#FF223B] bg-clip-text text-transparent">
            DAMAGE
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-base sm:text-lg md:text-xl text-[#F2EDE7]/60 text-center mb-8 sm:mb-12 md:mb-20"
        >
          Collective pain measured in real numbers
        </motion.p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="relative group"
            >
              <div className="bg-[#F2EDE7]/5 border border-[#F2EDE7]/10 p-6 sm:p-8 hover:bg-[#F2EDE7]/10 hover:border-[#FF6B00]/50 transition-all duration-300 h-full" style={{ borderRadius: 0 }}>
                <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 bg-gradient-to-r from-[#FF6B00] via-[#FF223B] to-[#FF6B00] flex items-center justify-center group-hover:scale-110 transition-transform duration-300" style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)' }}>
                  <stat.icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                </div>

                <div 
                  className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#F2EDE7] mb-2 sm:mb-3 text-center"
                  style={{ fontFamily: 'TECHNOS, sans-serif' }}
                >
                  <CountUp end={stat.value} format={stat.format} />
                </div>

                <p className="text-[#F2EDE7]/60 text-center text-xs sm:text-sm uppercase tracking-wider">
                  {stat.label}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-12 sm:mt-16 text-center px-4"
        >
          <p className="text-[#F2EDE7]/40 text-base sm:text-lg italic">
            "Every number represents a diamond hand that held too long..."
          </p>
        </motion.div>
      </div>
    </section>
  );
}
