import React from "react";
import { Crown, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SponsoredSlot({ slot, rank }) {
  const getRankColor = (r) => {
    if (r === 1) return "from-[#FFD700] to-[#FFA500]";
    if (r === 2) return "from-[#C0C0C0] to-[#A8A8A8]";
    if (r === 3) return "from-[#CD7F32] to-[#B8860B]";
    return "from-white/10 to-white/5";
  };

  if (!slot) {
    return (
      <div className="bg-white/5 border-2 border-dashed border-white/20 p-4 hover:border-[#FF5C1A]/50 transition-all group cursor-pointer" style={{ borderRadius: 0 }}>
        <div className="text-center">
          <div className="w-12 h-12 bg-black border border-white/20 mx-auto mb-3 flex items-center justify-center group-hover:border-white/40 transition-all" style={{ borderRadius: 0 }}>
            <Crown className="w-6 h-6 text-white/40" />
          </div>
          <p className="text-white/60 text-xs mb-1">Slot #{rank}</p>
          <p className="text-white/40 text-[10px] mb-3">Available</p>
          <Button 
            className="w-full bg-gradient-to-r from-[#FF5C1A] via-[#FF223B] to-[#30080C] hover:shadow-lg hover:shadow-[#FF5C1A]/50 text-xs h-7" 
            style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 5px), calc(100% - 5px) 100%, 0 100%)', borderRadius: 0 }}
          >
            Bid Now
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-br ${getRankColor(rank)} p-[2px] hover:scale-105 transition-all`} style={{ borderRadius: 0 }}>
      <div className="bg-black p-4 relative" style={{ borderRadius: 0 }}>
        <div className="absolute top-2 right-2">
          <div className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black text-[10px] font-bold px-2 py-0.5 flex items-center gap-1" style={{ borderRadius: 0 }}>
            <Crown className="w-2.5 h-2.5" />
            #{rank}
          </div>
        </div>

        <div className="flex items-start gap-3 mb-3">
          <div className="w-10 h-10 bg-black border border-white/20 flex items-center justify-center text-lg flex-shrink-0" style={{ borderRadius: 0 }}>
            {slot.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-bold text-sm mb-0.5 truncate">{slot.name}</h3>
            <p className="text-white/60 text-[10px] line-clamp-2">{slot.description}</p>
          </div>
        </div>

        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <TrendingUp className="w-3 h-3 text-[#14F195]" />
            <span className="text-[#14F195] text-xs font-semibold">{slot.currentBid} SOL</span>
          </div>
          <span className="text-white/40 text-[10px]">Current Bid</span>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {slot.tags.map((tag, i) => (
            <span key={i} className="bg-white/10 text-white/80 text-[9px] px-1.5 py-0.5" style={{ borderRadius: 0 }}>
              {tag}
            </span>
          ))}
        </div>

        <Button 
          className="w-full bg-white/10 hover:bg-white/20 text-white border-none h-7 text-xs" 
          style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 5px), calc(100% - 5px) 100%, 0 100%)', borderRadius: 0 }}
        >
          Outbid
        </Button>
      </div>
    </div>
  );
}