
import React from "react";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function WalletInput({ wallet, setWallet, onAnalyze, isAnalyzing }) {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-[#F2EDE7]/5 border border-[#F2EDE7]/10 p-6 md:p-8" style={{ borderRadius: 0 }}>
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            type="text"
            placeholder="Enter your Solana wallet address..."
            value={wallet}
            onChange={(e) => setWallet(e.target.value)}
            className="h-14 text-base bg-[#0D0D0D] border-[#F2EDE7]/20 text-[#F2EDE7] placeholder:text-[#F2EDE7]/40 focus:border-[#FF6B00] transition-all flex-1"
            style={{ borderRadius: 0 }}
            disabled={isAnalyzing}
          />
          <Button
            onClick={onAnalyze}
            disabled={isAnalyzing || !wallet.trim()}
            className="h-14 px-8 text-base font-bold bg-gradient-to-r from-[#FF6B00] to-[#FF223B] hover:shadow-lg hover:shadow-[#FF223B]/50 text-white transition-all"
            style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)', borderRadius: 0, fontFamily: 'TECHNOS, sans-serif' }}
          >
            {isAnalyzing ? (
              <>
                <div className="w-5 h-5 mr-2 border-2 border-white border-t-transparent" style={{ borderRadius: 0 }} />
                ANALYZING
              </>
            ) : (
              <>
                <Search className="w-5 h-5 mr-2" />
                SCAN WALLET
              </>
            )}
          </Button>
        </div>
        <p className="text-xs text-[#F2EDE7]/40 mt-3">
          Example: 9W3xHj9kUK7eJXR3QMNz6T8f2A4vPkLmC5dN1sB6wX9Y
        </p>
      </div>
    </div>
  );
}
