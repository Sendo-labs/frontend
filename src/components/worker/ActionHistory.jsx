import React from "react";
import { History, TrendingDown, DollarSign, AlertCircle, CheckCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ACTION_ICONS = {
  SELL_DUST: TrendingDown,
  TAKE_PROFIT: DollarSign,
  REBALANCE: AlertCircle
};

export default function ActionHistory({ history }) {
  const formatTime = (date) => {
    const now = new Date();
    const diff = Math.floor((now - date) / 1000); // seconds
    
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <History className="w-5 h-5 text-[#F2EDE7]/60" />
        <h2 className="text-xl font-bold text-[#F2EDE7] uppercase" style={{ fontFamily: 'TECHNOS, sans-serif' }}>
          HISTORY
        </h2>
        {history.length > 0 && (
          <span className="text-sm text-[#F2EDE7]/40">({history.length})</span>
        )}
      </div>

      {history.length === 0 ? (
        <div className="bg-[#F2EDE7]/5 border border-[#F2EDE7]/10 p-8 text-center" style={{ borderRadius: 0 }}>
          <History className="w-12 h-12 text-[#F2EDE7]/20 mx-auto mb-3" />
          <p className="text-[#F2EDE7]/40 text-sm">
            No actions executed yet. Start by accepting or rejecting suggested actions above.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {history.map((action, index) => {
              const Icon = ACTION_ICONS[action.type] || AlertCircle;
              const isAccepted = action.accepted;
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3 }}
                  className={`border p-4 opacity-70 hover:opacity-90 transition-opacity ${
                    isAccepted 
                      ? 'bg-[#14F195]/5 border-[#14F195]/20' 
                      : 'bg-[#FF223B]/5 border-[#FF223B]/20'
                  }`}
                  style={{ borderRadius: 0 }}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 flex items-center justify-center flex-shrink-0 ${
                      isAccepted ? 'bg-[#14F195]/20' : 'bg-[#FF223B]/20'
                    }`} 
                         style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)' }}>
                      <Icon className={`w-5 h-5 ${isAccepted ? 'text-[#14F195]' : 'text-[#FF223B]'}`} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-base font-bold text-[#F2EDE7]/70 uppercase" style={{ fontFamily: 'TECHNOS, sans-serif' }}>
                          {action.type.replace(/_/g, " ")}
                        </h3>
                        <div className={`flex items-center gap-1 text-xs font-bold ${
                          isAccepted ? 'text-[#14F195]' : 'text-[#FF223B]'
                        }`}>
                          {isAccepted ? (
                            <>
                              <CheckCircle className="w-3 h-3" />
                              <span>ACCEPTED</span>
                            </>
                          ) : (
                            <>
                              <X className="w-3 h-3" />
                              <span>REJECTED</span>
                            </>
                          )}
                        </div>
                      </div>

                      <p className="text-sm text-[#F2EDE7]/50 mb-2">
                        {action.reason}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-2 text-xs">
                          {action.tokens && (
                            <span className="text-[#F2EDE7]/40">
                              {action.tokens.join(", ")}
                            </span>
                          )}
                          {action.token && (
                            <span className="text-[#F2EDE7]/40">
                              {action.token}
                            </span>
                          )}
                          <span className={`font-bold ${isAccepted ? 'text-[#14F195]/60' : 'text-[#FF223B]/60'}`}>
                            ${action.est_usd.toFixed(2)}
                          </span>
                        </div>
                        <span className="text-xs text-[#F2EDE7]/30">
                          {formatTime(action.executedAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}