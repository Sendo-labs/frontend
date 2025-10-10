
import React from "react";
import { Plus, FileText, Terminal, Settings, Home, Wallet, Store, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const agents = [
  {
    id: "sendo",
    name: "SENDO",
    description: "Crypto analysis expert",
    avatar: "🔥",
    active: true
  },
  {
    id: "trader",
    name: "Trader Bot",
    description: "Trading strategies",
    avatar: "📈",
    active: true
  },
  {
    id: "research",
    name: "Research AI",
    description: "Market research",
    avatar: "🔍",
    active: false
  },
  {
    id: "whale",
    name: "Whale Tracker",
    description: "Track big moves",
    avatar: "🐋",
    active: true
  },
];

export default function AgentSidebar({ selectedAgent, onSelectAgent }) {
  return (
    <div className="w-64 bg-[#0A0A0A] border-r border-white/10 flex flex-col h-screen">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <Link to={createPageUrl("Home")}>
          <img
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/user_68a5890717a68547c2e56d25/69d2f6e2e_SENDO_red2x.png"
            alt="SENDO"
            className="h-6 mb-1"
          />
        </Link>
        <p className="text-xs text-white/30">v1.0.0</p>

        <Button
          className="w-full bg-white/5 hover:bg-white/10 text-white border-none h-10 text-sm mt-4"
          size="sm"
          style={{ borderRadius: 0 }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Create New
        </Button>
      </div>

      {/* Agents List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-3">
          <p className="text-xs text-white/30 uppercase tracking-wider mb-3">Plugins</p>
          {agents.map((agent) => (
            <button
              key={agent.id}
              onClick={() => onSelectAgent(agent)}
              className={`w-full p-3 rounded-lg mb-2 text-left transition-all flex items-center justify-between group ${
                selectedAgent?.id === agent.id
                  ? "bg-white/10"
                  : "hover:bg-white/5"
              }`}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#FF5C1A] to-[#E31D1C] flex items-center justify-center text-sm flex-shrink-0">
                  {agent.avatar}
                </div>
                <span className="text-sm text-white truncate">{agent.name}</span>
              </div>
              {agent.active && (
                <div className="w-2 h-2 bg-[#14F195] rounded-full flex-shrink-0" />
              )}
            </button>
          ))}
        </div>

        <div className="p-3">
          <p className="text-xs text-white/30 uppercase tracking-wider mb-3">Groups</p>
          <button className="w-full p-3 rounded-lg text-left hover:bg-white/5 transition-all flex items-center gap-3">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#FF5C1A] to-[#E31D1C] flex items-center justify-center text-sm border border-black">
                🔥
              </div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#14F195] to-[#00D9B5] flex items-center justify-center text-sm border border-black">
                📈
              </div>
            </div>
            <span className="text-sm text-white">Swarm</span>
          </button>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="border-t border-white/10 p-3">
        <p className="text-xs text-white/30 uppercase tracking-wider mb-3">Navigation</p>
        <Link to={createPageUrl("Home")}>
          <button className="w-full p-3 hover:bg-white/5 transition-all flex items-center gap-3 text-white/60 hover:text-white mb-1" style={{ borderRadius: 0 }}>
            <Home className="w-4 h-4" />
            <span className="text-sm">Home</span>
          </button>
        </Link>
        <Link to={createPageUrl("Dashboard")}>
          <button className="w-full p-3 hover:bg-white/5 transition-all flex items-center gap-3 text-white/60 hover:text-white mb-1" style={{ borderRadius: 0 }}>
            <Wallet className="w-4 h-4" />
            <span className="text-sm">Wallet Analyzer</span>
          </button>
        </Link>
        <Link to={createPageUrl("Marketplace")}>
          <button className="w-full p-3 hover:bg-white/5 transition-all flex items-center gap-3 text-white/60 hover:text-white mb-1" style={{ borderRadius: 0 }}>
            <Store className="w-4 h-4" />
            <span className="text-sm">Marketplace</span>
          </button>
        </Link>
        <Link to={createPageUrl("Leaderboard")}>
          <button className="w-full p-3 hover:bg-white/5 transition-all flex items-center gap-3 text-white/60 hover:text-white mb-1" style={{ borderRadius: 0 }}>
            <Trophy className="w-4 h-4" />
            <span className="text-sm">Looserboard</span>
          </button>
        </Link>

        <button className="w-full p-3 hover:bg-white/5 transition-all flex items-center gap-3 text-white/60 hover:text-white mt-2 border-t border-white/10" style={{ borderRadius: 0 }}>
          <FileText className="w-4 h-4" />
          <span className="text-sm">Documentation</span>
        </button>
        <button className="w-full p-3 hover:bg-white/5 transition-all flex items-center gap-3 text-white/60 hover:text-white" style={{ borderRadius: 0 }}>
          <Terminal className="w-4 h-4" />
          <span className="text-sm">Logs</span>
        </button>
        <button className="w-full p-3 hover:bg-white/5 transition-all flex items-center gap-3 text-white/60 hover:text-white" style={{ borderRadius: 0 }}>
          <Settings className="w-4 h-4" />
          <span className="text-sm">Settings</span>
        </button>
        <div className="p-3 flex items-center gap-3">
          <div className="w-2 h-2 bg-[#14F195] animate-pulse" style={{ borderRadius: 0 }} />
          <span className="text-xs text-[#14F195]">Connected</span>
        </div>
      </div>
    </div>
  );
}
