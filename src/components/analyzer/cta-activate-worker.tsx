"use client";

import React from "react";
import { motion } from "framer-motion";
import { Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CTAActivateWorker() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
      className="bg-gradient-to-br from-[#FF6B00]/10 to-[#FF223B]/10 border border-[#FF6B00]/30 p-6 relative overflow-hidden group hover:border-[#FF6B00]/50 transition-all"
      style={{ borderRadius: 0 }}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF6B00]/5 blur-3xl" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-10 h-10 bg-gradient-to-r from-[#FF6B00] to-[#FF223B] flex items-center justify-center" style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)' }}>
            <Zap className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-[#F2EDE7] uppercase text-sm font-bold title-font">
            TIRED OF MISSING ATHS?
          </h3>
        </div>

        <p className="text-[#F2EDE7]/70 text-sm mb-4">
          Activate the Worker to get real-time suggestions and automate your exit strategy. Never miss a top again 🎯
        </p>

        <ul className="space-y-2 mb-6">
          <li className="flex items-center gap-2 text-[#F2EDE7]/60 text-sm">
            <div className="w-1.5 h-1.5 bg-[#FF6B00]" style={{ borderRadius: 0 }} />
            Auto take-profit alerts
          </li>
          <li className="flex items-center gap-2 text-[#F2EDE7]/60 text-sm">
            <div className="w-1.5 h-1.5 bg-[#FF6B00]" style={{ borderRadius: 0 }} />
            Dust token cleanup
          </li>
          <li className="flex items-center gap-2 text-[#F2EDE7]/60 text-sm">
            <div className="w-1.5 h-1.5 bg-[#FF6B00]" style={{ borderRadius: 0 }} />
            Portfolio rebalancing
          </li>
        </ul>

        <Link href="/worker">
          <Button
            className="w-full bg-gradient-to-r from-[#FF6B00] to-[#FF223B] hover:shadow-lg hover:shadow-[#FF223B]/50 text-white h-12 group title-font"
            style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)', borderRadius: 0 }}
          >
            ACTIVATE WORKER
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}
