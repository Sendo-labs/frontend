import React, { useState, useEffect } from "react";
import AgentSidebar from "../components/agent/AgentSidebar";
import ChatInterface from "../components/agent/ChatInterface";
import WalletAnalysisModal from "../components/agent/WalletAnalysisModal";
import { useElizaAgent } from "@/hooks/useElizaAgent";
import { Loader2 } from "lucide-react";

export default function Agent() {
  const { agent, isLoading, error } = useElizaAgent();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const action = urlParams.get('action');
    const wallet = urlParams.get('wallet');

    if (action === 'scan') {
      setShowWalletModal(true);
      if (wallet) {
        setWalletAddress(wallet);
      }
    }
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex h-screen bg-black items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#FF5C1A] mx-auto mb-4" />
          <p className="text-white/60">Loading SENDO agent...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !agent) {
    return (
      <div className="flex h-screen bg-black items-center justify-center">
        <div className="text-center max-w-md p-6">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-white mb-2">Unable to connect to SENDO</h2>
          <p className="text-white/60 mb-4">
            {error || 'Make sure the Eliza server is running on http://localhost:3000'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-gradient-to-r from-[#FF5C1A] via-[#FF223B] to-[#30080C] text-white"
            style={{ borderRadius: 0 }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex h-screen bg-black overflow-hidden relative">
        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/60 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div className={`
          fixed md:relative z-50 md:z-0
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}>
          <AgentSidebar
            agent={agent}
            onClose={() => setSidebarOpen(false)}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          <ChatInterface
            agent={agent}
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          />
        </div>
      </div>

      {/* Wallet Analysis Modal */}
      <WalletAnalysisModal
        isOpen={showWalletModal}
        onClose={() => setShowWalletModal(false)}
        walletAddress={walletAddress}
        agent={agent}
      />
    </>
  );
}