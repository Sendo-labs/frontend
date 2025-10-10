import React, { useState, useEffect } from "react";
import AgentSidebar from "../components/agent/AgentSidebar";
import ChatInterface from "../components/agent/ChatInterface";
import WalletAnalysisModal from "../components/agent/WalletAnalysisModal";

export default function Agent() {
  const [selectedAgent, setSelectedAgent] = useState({
    id: "sendo",
    name: "SENDO",
    description: "Crypto analysis expert",
    avatar: "🔥",
    active: true,
  });
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
            selectedAgent={selectedAgent}
            onSelectAgent={(agent) => {
              setSelectedAgent(agent);
              setSidebarOpen(false);
            }}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <ChatInterface 
            agent={selectedAgent} 
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          />
        </div>
      </div>

      {/* Wallet Analysis Modal */}
      <WalletAnalysisModal
        isOpen={showWalletModal}
        onClose={() => setShowWalletModal(false)}
        walletAddress={walletAddress}
        onSelectAgent={(agent) => {
          setSelectedAgent(agent);
          setShowWalletModal(false);
        }}
      />
    </>
  );
}