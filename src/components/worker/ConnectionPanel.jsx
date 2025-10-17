import React from "react";
import { Link, CheckCircle, XCircle, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const AVAILABLE_CONNECTIONS = [
  { id: "jupiter", name: "Jupiter", type: "oauth", connected: true, logo: "🪐" },
  { id: "raydium", name: "Raydium", type: "oauth", connected: false, logo: "⚡" },
  { id: "defi_provider_x", name: "DeFi Provider X", type: "api_key", connected: true, logo: "🔑" },
  { id: "birdeye", name: "Birdeye", type: "api_key", connected: false, logo: "👁️" }
];

export default function ConnectionPanel({ connections, onAddConnection, onRemoveConnection }) {
  const connectedServices = AVAILABLE_CONNECTIONS.filter(c => 
    (c.type === "oauth" && connections.oauth.includes(c.id)) ||
    (c.type === "api_key" && connections.api_keys.includes(c.id))
  );

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Link className="w-5 h-5 text-[#FF6B00]" />
        <h2 className="text-xl font-bold text-[#F2EDE7] uppercase" style={{ fontFamily: 'TECHNOS, sans-serif' }}>
          CONNECTIONS
        </h2>
      </div>

      <div className="bg-[#F2EDE7]/5 border border-[#F2EDE7]/10 p-4" style={{ borderRadius: 0 }}>
        {/* Connected Services */}
        <div className="mb-4">
          <h3 className="text-xs text-[#F2EDE7]/60 uppercase mb-3">
            Connected Services
          </h3>
          {connectedServices.length > 0 ? (
            <div className="space-y-2">
              {connectedServices.map((service) => (
                <div
                  key={service.id}
                  className="flex items-center justify-between p-3 bg-[#14F195]/10 border border-[#14F195]/30 group"
                  style={{ borderRadius: 0 }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{service.logo}</span>
                    <div>
                      <p className="text-sm font-semibold text-[#F2EDE7]">{service.name}</p>
                      <p className="text-xs text-[#F2EDE7]/60">{service.type === "oauth" ? "OAuth" : "API Key"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-[#14F195]" />
                    <button
                      onClick={() => onRemoveConnection(service.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 bg-[#FF223B]/20 hover:bg-[#FF223B]/40 flex items-center justify-center"
                      style={{ borderRadius: 0 }}
                    >
                      <X className="w-4 h-4 text-[#FF223B]" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[#F2EDE7]/40 text-sm text-center py-4">
              No connections yet. Add one below!
            </p>
          )}
        </div>

        <Button
          onClick={onAddConnection}
          className="w-full bg-[#F2EDE7]/5 border border-[#F2EDE7]/10 hover:bg-[#F2EDE7]/10 hover:border-[#FF6B00]/50 text-[#F2EDE7] h-10"
          style={{ borderRadius: 0 }}
        >
          <Plus className="w-4 h-4 mr-2" />
          <span style={{ fontFamily: 'TECHNOS, sans-serif' }}>ADD CONNECTION</span>
        </Button>
      </div>
    </div>
  );
}