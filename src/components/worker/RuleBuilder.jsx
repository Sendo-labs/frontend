
import React, { useState } from "react";
import { Settings, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

const RULE_LABELS = {
  sell_dust: "Sell Dust Tokens",
  take_profit: "Take Profit Automation",
  rebalance: "Portfolio Rebalancing"
};

const RULE_DESCRIPTIONS = {
  sell_dust: "Automatically sell tokens below a certain USD value",
  take_profit: "Take profits when tokens reach your target percentage",
  rebalance: "Maintain target portfolio allocation"
};

export default function RuleBuilder({ rules, onRuleUpdate }) {
  const [expandedRule, setExpandedRule] = useState(null);

  const toggleRule = (ruleId) => {
    setExpandedRule(expandedRule === ruleId ? null : ruleId);
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Settings className="w-5 h-5 text-[#FF6B00]" />
        <h2 className="text-xl font-bold text-[#F2EDE7] uppercase" style={{ fontFamily: 'TECHNOS, sans-serif' }}>
          AUTOMATION <span className="bg-gradient-to-r from-[#FF6B00] to-[#FF223B] bg-clip-text text-transparent">RULES</span>
        </h2>
      </div>

      <div className="space-y-3">
        {rules.map((rule) => (
          <div
            key={rule.id}
            className="bg-[#F2EDE7]/5 border border-[#F2EDE7]/10 overflow-hidden transition-all"
            style={{ borderRadius: 0 }}
          >
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <Switch
                  checked={rule.enabled}
                  onCheckedChange={(checked) => onRuleUpdate(rule.id, { enabled: checked })}
                />
                <div className="flex-1">
                  <h3 className="text-base font-bold text-[#F2EDE7] mb-0.5">
                    {RULE_LABELS[rule.id]}
                  </h3>
                  <p className="text-xs text-[#F2EDE7]/60">
                    {RULE_DESCRIPTIONS[rule.id]}
                  </p>
                </div>
              </div>

              <Button
                onClick={() => toggleRule(rule.id)}
                variant="ghost"
                size="icon"
                className="text-[#F2EDE7]/60 hover:text-[#F2EDE7] hover:bg-[#F2EDE7]/10"
                style={{ borderRadius: 0 }}
              >
                {expandedRule === rule.id ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </Button>
            </div>

            {expandedRule === rule.id && (
              <div className="px-4 pb-4 border-t border-[#F2EDE7]/10 pt-4">
                {rule.id === "sell_dust" && (
                  <div>
                    <label className="text-xs text-[#F2EDE7]/60 mb-2 block">
                      Minimum USD Value
                    </label>
                    <Input
                      type="number"
                      value={rule.params.min_usd}
                      onChange={(e) => onRuleUpdate(rule.id, { 
                        params: { ...rule.params, min_usd: Number(e.target.value) } 
                      })}
                      className="h-10 bg-[#0D0D0D] border-[#F2EDE7]/20 text-[#F2EDE7]"
                      style={{ borderRadius: 0 }}
                      placeholder="15"
                    />
                    <p className="text-xs text-[#F2EDE7]/40 mt-2">
                      Tokens valued below this amount will be sold
                    </p>
                  </div>
                )}

                {rule.id === "take_profit" && (
                  <div>
                    <label className="text-xs text-[#F2EDE7]/60 mb-2 block">
                      Target Profit Percentage
                    </label>
                    <Input
                      type="number"
                      value={rule.params.target_pct}
                      onChange={(e) => onRuleUpdate(rule.id, { 
                        params: { ...rule.params, target_pct: Number(e.target.value) } 
                      })}
                      className="h-10 bg-[#0D0D0D] border-[#F2EDE7]/20 text-[#F2EDE7]"
                      style={{ borderRadius: 0 }}
                      placeholder="25"
                    />
                    <p className="text-xs text-[#F2EDE7]/40 mt-2">
                      Sell when token is within this % of ATH
                    </p>
                  </div>
                )}

                {rule.id === "rebalance" && (
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-[#F2EDE7]/60 mb-2 block">
                        SOL Target %
                      </label>
                      <Input
                        type="number"
                        value={rule.params.target.SOL * 100}
                        onChange={(e) => onRuleUpdate(rule.id, { 
                          params: { 
                            target: { 
                              ...rule.params.target, 
                              SOL: Number(e.target.value) / 100 
                            } 
                          } 
                        })}
                        className="h-10 bg-[#0D0D0D] border-[#F2EDE7]/20 text-[#F2EDE7]"
                        style={{ borderRadius: 0 }}
                        placeholder="60"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-[#F2EDE7]/60 mb-2 block">
                        USDC Target %
                      </label>
                      <Input
                        type="number"
                        value={rule.params.target.USDC * 100}
                        onChange={(e) => onRuleUpdate(rule.id, { 
                          params: { 
                            target: { 
                              ...rule.params.target, 
                              USDC: Number(e.target.value) / 100 
                            } 
                          } 
                        })}
                        className="h-10 bg-[#0D0D0D] border-[#F2EDE7]/20 text-[#F2EDE7]"
                        style={{ borderRadius: 0 }}
                        placeholder="40"
                      />
                    </div>
                    <p className="text-xs text-[#F2EDE7]/40">
                      Automatically rebalance when allocation deviates by 10%+
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
