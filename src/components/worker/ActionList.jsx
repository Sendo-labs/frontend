import React from "react";
import { TrendingDown, DollarSign, AlertCircle, CheckCircle, Clock, Zap, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const ACTION_ICONS = {
  SELL_DUST: TrendingDown,
  TAKE_PROFIT: DollarSign,
  REBALANCE: AlertCircle
};

const PRIORITY_COLORS = {
  high: "border-[#FF223B] bg-[#FF223B]/10",
  medium: "border-[#FF6B00] bg-[#FF6B00]/10",
  low: "border-[#F2EDE7] bg-[#F2EDE7]/5"
};

const PRIORITY_TEXT = {
  high: "text-[#FF223B]",
  medium: "text-[#FF6B00]",
  low: "text-[#F2EDE7]/60"
};

export default function ActionList({ proposals, onAccept, onReject, onValidateAll, isExecuting, mode }) {
  if (!proposals || proposals.length === 0) {
    return (
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-5 h-5 text-[#FF6B00]" />
          <h2 className="text-xl font-bold text-[#F2EDE7] uppercase" style={{ fontFamily: 'TECHNOS, sans-serif' }}>
            SUGGESTED <span className="bg-gradient-to-r from-[#FF6B00] to-[#FF223B] bg-clip-text text-transparent">ACTIONS</span>
          </h2>
        </div>
        <div className="bg-[#F2EDE7]/5 border border-[#F2EDE7]/10 p-12 text-center" style={{ borderRadius: 0 }}>
          <CheckCircle className="w-12 h-12 text-[#14F195] mx-auto mb-4" />
          <h3 className="text-xl font-bold text-[#F2EDE7] mb-2" style={{ fontFamily: 'TECHNOS, sans-serif' }}>
            All Clear! 🎉
          </h3>
          <p className="text-[#F2EDE7]/60">
            No actions needed right now. Your portfolio is looking good.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-[#FF6B00]" />
          <h2 className="text-xl font-bold text-[#F2EDE7] uppercase" style={{ fontFamily: 'TECHNOS, sans-serif' }}>
            SUGGESTED <span className="bg-gradient-to-r from-[#FF6B00] to-[#FF223B] bg-clip-text text-transparent">ACTIONS</span>
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#F2EDE7]/40" />
            <span className="text-xs text-[#F2EDE7]/40">Updated 2 min ago</span>
          </div>
          {mode === "suggest" && proposals.length > 1 && (
            <Button
              onClick={onValidateAll}
              disabled={isExecuting}
              className="bg-[#14F195] hover:bg-[#14F195]/80 text-black h-10 px-4"
              style={{ borderRadius: 0, fontFamily: 'TECHNOS, sans-serif' }}
            >
              <Check className="w-4 h-4 mr-2" />
              VALIDATE ALL
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {proposals.map((proposal, index) => {
          const Icon = ACTION_ICONS[proposal.type] || AlertCircle;
          
          return (
            <div
              key={index}
              className={`border p-4 md:p-6 transition-all hover:scale-[1.02] ${PRIORITY_COLORS[proposal.priority]}`}
              style={{ borderRadius: 0 }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className={`w-10 h-10 bg-gradient-to-r from-[#FF6B00] to-[#FF223B] flex items-center justify-center flex-shrink-0`} 
                       style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)' }}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-bold text-[#F2EDE7] uppercase" style={{ fontFamily: 'TECHNOS, sans-serif' }}>
                        {proposal.type.replace(/_/g, " ")}
                      </h3>
                      <span className={`text-xs font-bold uppercase ${PRIORITY_TEXT[proposal.priority]}`}>
                        {proposal.priority}
                      </span>
                    </div>

                    <p className="text-sm text-[#F2EDE7]/70 mb-3">
                      {proposal.reason}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {proposal.tokens && (
                        <div className="text-xs text-[#F2EDE7]/60">
                          <span className="font-semibold">Tokens:</span> {proposal.tokens.join(", ")}
                        </div>
                      )}
                      {proposal.token && (
                        <div className="text-xs text-[#F2EDE7]/60">
                          <span className="font-semibold">Token:</span> {proposal.token}
                        </div>
                      )}
                      {proposal.size_pct && (
                        <div className="text-xs text-[#F2EDE7]/60">
                          <span className="font-semibold">Size:</span> {proposal.size_pct}%
                        </div>
                      )}
                      <div className="text-xs font-bold text-[#14F195]">
                        ~${proposal.est_usd.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>

                {mode === "suggest" && (
                  <div className="flex gap-2 flex-shrink-0">
                    <Button
                      onClick={() => onAccept(proposal)}
                      disabled={isExecuting}
                      className="bg-[#14F195] hover:bg-[#14F195]/80 text-black h-10 w-10 p-0 flex items-center justify-center"
                      style={{ borderRadius: 0 }}
                    >
                      <Check className="w-5 h-5" />
                    </Button>
                    <Button
                      onClick={() => onReject(proposal)}
                      disabled={isExecuting}
                      className="bg-[#FF223B] hover:bg-[#FF223B]/80 text-white h-10 w-10 p-0 flex items-center justify-center"
                      style={{ borderRadius: 0 }}
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                )}

                {mode === "auto" && (
                  <div className="flex items-center gap-2 text-xs text-[#14F195] flex-shrink-0">
                    <CheckCircle className="w-4 h-4" />
                    <span className="font-semibold">AUTO</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}