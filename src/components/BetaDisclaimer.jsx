import React, { useState, useEffect } from "react";
import { AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BetaDisclaimer() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasAccepted = localStorage.getItem('sendo-beta-disclaimer-accepted');
    if (!hasAccepted) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('sendo-beta-disclaimer-accepted', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 sm:p-4">
      <div 
        className="w-full max-w-2xl bg-black border-2 border-[#FF5C1A] p-4 sm:p-6 md:p-8 relative max-h-[90vh] overflow-y-auto"
        style={{ borderRadius: 0 }}
      >
        {/* Warning Icon */}
        <div className="flex justify-center mb-4 sm:mb-6">
          <div 
            className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-[#FF5C1A] via-[#FF223B] to-[#30080C] flex items-center justify-center"
            style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)' }}
          >
            <AlertTriangle className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>
        </div>

        {/* Title */}
        <h2 
          className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-3 sm:mb-4 text-white"
          style={{ fontFamily: 'TECHNOS, sans-serif' }}
        >
          <span className="bg-gradient-to-r from-[#FF5C1A] via-[#FF223B] to-[#30080C] bg-clip-text text-transparent">
            BETA VERSION
          </span>
          {" "}WARNING
        </h2>

        {/* Content */}
        <div className="space-y-3 sm:space-y-4 text-white/80 text-xs sm:text-sm md:text-base mb-4 sm:mb-6">
          <p className="leading-relaxed">
            <strong className="text-[#FF5C1A]">Important Notice:</strong> SENDO is currently in beta version. 
            <strong className="text-white"> DO NOT connect your main wallet</strong> or proceed at your own risk.
          </p>

          <p className="leading-relaxed">
            SENDO provides an architecture for creating AI agents. The plugins available on our marketplace are 
            <strong className="text-white"> independent third-party services</strong> that can be built and deployed 
            <strong className="text-white"> without verification from our team</strong>.
          </p>

          <p className="leading-relaxed">
            By using SENDO and any plugins, you acknowledge that:
          </p>

          <ul className="list-disc list-inside space-y-1.5 sm:space-y-2 pl-2 sm:pl-4 text-white/70">
            <li>You use the platform and plugins at your own risk</li>
            <li>Plugin creators are independent providers</li>
            <li>SENDO is not responsible for plugin functionality or security</li>
            <li>You should only connect test wallets with minimal funds</li>
            <li>This is experimental software in active development</li>
          </ul>

          <div className="bg-[#FF5C1A]/10 border border-[#FF5C1A]/30 p-3 sm:p-4 mt-3 sm:mt-4" style={{ borderRadius: 0 }}>
            <p className="text-[#FF5C1A] font-semibold text-center text-xs sm:text-sm">
              ⚠️ USE AT YOUR OWN RISK ⚠️
            </p>
          </div>
        </div>

        {/* Accept Button */}
        <Button
          onClick={handleAccept}
          className="w-full h-12 sm:h-14 text-sm sm:text-base md:text-lg font-bold bg-gradient-to-r from-[#FF5C1A] via-[#FF223B] to-[#30080C] hover:shadow-lg hover:shadow-[#FF5C1A]/50 transition-all"
          style={{ 
            clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)',
            borderRadius: 0
          }}
        >
          I UNDERSTAND AND ACCEPT THE RISKS
        </Button>

        <p className="text-white/40 text-[10px] sm:text-xs text-center mt-3 sm:mt-4">
          By clicking accept, you acknowledge that you have read and understood this warning
        </p>
      </div>
    </div>
  );
}