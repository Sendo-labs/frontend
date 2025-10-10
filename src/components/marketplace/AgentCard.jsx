import React from "react";
import { Coins } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AgentCard({ agent }) {
  return (
    <div className="bg-white/5 border border-white/10 p-4 hover:bg-white/10 hover:border-[#FF5C1A]/50 transition-all group" style={{ borderRadius: 0 }}>
      <div className="flex items-start gap-3 mb-3">
        <div className="w-12 h-12 bg-black border border-white/20 flex items-center justify-center text-2xl flex-shrink-0" style={{ borderRadius: 0 }}>
          {agent.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-bold text-sm mb-1 truncate">{agent.name}</h3>
          <div className="flex items-center gap-2">
            <Coins className="w-3 h-3 text-[#FFB800]" />
            <span className="text-[#FFB800] text-xs font-semibold">{agent.price} SOL</span>
          </div>
        </div>
      </div>
      
      <p className="text-white/70 text-xs mb-3 line-clamp-2">{agent.description}</p>
      
      <div className="flex flex-wrap gap-1.5 mb-3">
        {agent.tags.map((tag, i) => (
          <span key={i} className="bg-white/10 text-white/60 text-[9px] px-1.5 py-0.5" style={{ borderRadius: 0 }}>
            {tag}
          </span>
        ))}
      </div>

      <Button 
        className="w-full bg-gradient-to-r from-[#FF5C1A] via-[#FF223B] to-[#30080C] hover:shadow-lg hover:shadow-[#FF5C1A]/50 h-8 text-xs"
        style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%)', borderRadius: 0 }}
      >
        Deploy Plugin
      </Button>
    </div>
  );
}