
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function AgentPanel({ context = {} }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Welcome message on first open
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: Date.now(),
          role: "assistant",
          content: "👋 Hey! I'm your sEnDO educational agent.\n\nI'm here to help you understand your wallet metrics, trading strategies, and crypto concepts.\n\n**Ask me anything!** For example:\n- \"Why did I miss so much on BONK?\"\n- \"What's ATH and why does it matter?\"\n- \"How can Worker help me?\"\n- \"Explain take profit strategies\"",
          timestamp: new Date()
        }
      ]);
    }
  }, [isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      role: "user",
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const userInput = input;
    setInput("");
    setIsLoading(true);

    // Mock API call
    setTimeout(() => {
      const response = getEducationalResponse(userInput, context);
      
      const assistantMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-40 w-14 h-14 md:w-16 md:h-16 bg-gradient-to-r from-[#FF6B00] to-[#FF223B] hover:shadow-lg hover:shadow-[#FF223B]/50 flex items-center justify-center transition-all group"
            style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)' }}
          >
            <MessageCircle className="w-7 h-7 md:w-8 md:h-8 text-white group-hover:scale-110 transition-transform" />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-1 -right-1 w-3 h-3 bg-[#14F195]"
              style={{ borderRadius: 0 }}
            />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Drawer Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop for mobile */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 z-40 md:hidden"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="fixed bottom-0 right-0 z-50 w-full md:w-[400px] h-[80vh] md:h-[600px] md:bottom-6 md:right-6 bg-[#0D0D0D] border-2 border-[#FF6B00]/30 flex flex-col"
              style={{ borderRadius: 0 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-[#F2EDE7]/10 bg-gradient-to-r from-[#FF6B00]/10 to-[#FF223B]/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-[#FF6B00] to-[#FF223B] flex items-center justify-center" style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)' }}>
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-sm uppercase" style={{ fontFamily: 'TECHNOS, sans-serif' }}>
                      sEnDO <span className="bg-gradient-to-r from-[#FF6B00] to-[#FF223B] bg-clip-text text-transparent">AGENT</span>
                    </h3>
                    <p className="text-[#14F195] text-xs flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-[#14F195] animate-pulse" style={{ borderRadius: 0 }} />
                      ONLINE
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 bg-[#F2EDE7]/5 hover:bg-[#F2EDE7]/10 flex items-center justify-center transition-colors"
                  style={{ borderRadius: 0 }}
                >
                  <X className="w-5 h-5 text-[#F2EDE7]/60" />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    <div className={`w-8 h-8 flex items-center justify-center flex-shrink-0 ${
                      message.role === 'user'
                        ? 'bg-[#F2EDE7]/10'
                        : 'bg-gradient-to-r from-[#FF6B00] to-[#FF223B]'
                    }`} style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%)' }}>
                      {message.role === 'user' ? (
                        <span className="text-[#F2EDE7] text-xs">👤</span>
                      ) : (
                        <Sparkles className="w-4 h-4 text-white" />
                      )}
                    </div>

                    <div className={`flex-1 max-w-[80%] ${message.role === 'user' ? 'flex justify-end' : ''}`}>
                      <div className={`p-3 ${
                        message.role === 'user'
                          ? 'bg-gradient-to-r from-[#FF6B00] to-[#FF223B] text-white'
                          : 'bg-[#F2EDE7]/5 text-[#F2EDE7]'
                      }`} style={{ borderRadius: 0 }}>
                        <div className="text-sm leading-relaxed whitespace-pre-wrap">
                          {message.content}
                        </div>
                        <p className="text-[10px] mt-2 opacity-60">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-[#FF6B00] to-[#FF223B] flex items-center justify-center flex-shrink-0" style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%)' }}>
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-[#F2EDE7]/5 p-3" style={{ borderRadius: 0 }}>
                      <div className="w-4 h-4 border-2 border-[#FF6B00] border-t-transparent" style={{ borderRadius: 0 }} />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="border-t border-[#F2EDE7]/10 p-4 bg-[#0D0D0D]">
                <div className="flex items-end gap-2">
                  <Textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Ask me anything..."
                    className="bg-[#F2EDE7]/5 border-[#F2EDE7]/10 text-[#F2EDE7] placeholder:text-[#F2EDE7]/30 resize-none min-h-0"
                    disabled={isLoading}
                    rows={2}
                    style={{ borderRadius: 0 }}
                  />
                  
                  <Button
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading}
                    size="icon"
                    className="bg-gradient-to-r from-[#FF6B00] to-[#FF223B] hover:shadow-lg hover:shadow-[#FF223B]/50 flex-shrink-0 h-[72px] w-12"
                    style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)', borderRadius: 0 }}
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5" /> // Removed animate-spin
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </Button>
                </div>
                <p className="text-[#F2EDE7]/40 text-[10px] mt-2">
                  Press Enter to send • Shift+Enter for new line
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// Educational response logic
function getEducationalResponse(question, context) {
  const lowerQuestion = question.toLowerCase();

  // ATH related
  if (lowerQuestion.includes("ath") || lowerQuestion.includes("all time high")) {
    return "**ATH = ALL-TIME HIGH** 📈\n\nIt's the highest price a token ever reached. When you hold past ATH and the price drops, that's your \"missed profit\".\n\n💡 **Why it matters:**\n- Shows maximum potential gain\n- Reveals optimal exit timing\n- Highlights emotional trading mistakes\n\nMost traders hold through ATH hoping for more, then watch gains evaporate. That's the pain we measure! 💀";
  }

  // BONK or specific token
  if (lowerQuestion.includes("bonk") || lowerQuestion.includes("token") || lowerQuestion.includes("miss")) {
    return "**WHY YOU MISSED GAINS ON A TOKEN** 🎯\n\nWhen a token pumps to ATH and you don't sell:\n1. **Greed**: \"It'll go higher!\"\n2. **Hope**: \"It'll come back!\"\n3. **Diamond hands** syndrome 💎🙌\n\nThe gap between ATH and your sell price = your missed profit.\n\n💡 **Solution:** Use Worker to set automatic take-profit rules and never miss an exit again!";
  }

  // Worker related
  if (lowerQuestion.includes("worker") || lowerQuestion.includes("automat") || lowerQuestion.includes("help")) {
    return "**WORKER = YOUR AUTOMATED TRADING ASSISTANT** 🤖\n\n**2 MODES:**\n- **Suggest Mode**: Proposes actions, you approve\n- **Auto Mode**: Executes automatically\n\n**What it does:**\n✅ Sells dust tokens (<$15)\n✅ Takes profit at targets\n✅ Rebalances portfolio\n✅ Never sleeps or gets emotional\n\n💡 Connect Jupiter/Raydium and set your rules. Worker handles the rest!";
  }

  // Take profit
  if (lowerQuestion.includes("take profit") || lowerQuestion.includes("sell") || lowerQuestion.includes("exit")) {
    return "**Take Profit Strategy** 💰\n\nInstead of hoping for the moon, secure gains:\n\n**Ladder Exit:**\n- 25% at +50% gain\n- 25% at +100% gain\n- 25% at +200% gain\n- Let 25% ride\n\n**ATH-based:**\n- Sell 50% within 5% of ATH\n- Trail stop-loss for rest\n\n💡 Worker can automate this for you. Set rules → Sleep peacefully 😴";
  }

  // Dust tokens
  if (lowerQuestion.includes("dust") || lowerQuestion.includes("small") || lowerQuestion.includes("worthless")) {
    return "**Dust Tokens = Portfolio Clutter** 🧹\n\nTokens worth <$15 that:\n- Waste mental energy\n- Cost more in gas than they're worth\n- Never recover\n\n**Worker's \"Sell Dust\" rule:**\n- Scans your wallet daily\n- Identifies tokens below threshold\n- Proposes batch cleanup\n- Converts to SOL or USDC\n\n💡 Clean portfolio = clear mind!";
  }

  // Rebalance
  if (lowerQuestion.includes("rebalanc") || lowerQuestion.includes("portfolio") || lowerQuestion.includes("allocation")) {
    return "**Portfolio Rebalancing** ⚖️\n\nKeep your target allocation over time:\n\n**Example:**\nTarget: 60% SOL, 40% USDC\nActual: 80% SOL, 20% USDC (SOL pumped)\n\n**Rebalance:**\nSell 20% SOL → Buy USDC\n\n**Why:**\n- Lock in gains automatically\n- Maintain risk profile\n- \"Buy low, sell high\" by default\n\n💡 Worker can monitor and rebalance 24/7!";
  }

  // Rank/Leaderboard
  if (lowerQuestion.includes("rank") || lowerQuestion.includes("leaderboard") || lowerQuestion.includes("position")) {
    return "**Your Pain Rank** 🏆💀\n\nWe rank you by total missed profit:\n\n🐳 **Elite of Pain**: $100k+ missed\n💀 **Certified Bagholder**: $40k+ missed\n💎 **Diamond Hands**: $20k+ missed\n🤡 **Clown Prince**: $10k+ missed\n\nIt's sarcastic but real. The goal? Learn from mistakes, activate Worker, and climb the **Hall of Fame** instead (profitable exits)!\n\n💡 Share your rank to challenge friends 😈";
  }

  // Memory/Snapshots
  if (lowerQuestion.includes("memory") || lowerQuestion.includes("snapshot") || lowerQuestion.includes("history")) {
    return "**Memory Snapshots** 📸\n\nWe save daily snapshots of:\n- Wallet value\n- Missed profit vs ATH\n- Worker proposals\n- Executed actions\n\n**Why:**\n- Track progress over time\n- Feed Worker's learning\n- See if you're improving\n- Accountability\n\n💡 Coming soon: \"Memory Feed\" timeline view!";
  }

  // Slippage/Gas
  if (lowerQuestion.includes("slippage") || lowerQuestion.includes("gas") || lowerQuestion.includes("fee")) {
    return "**Slippage & Gas** ⛽\n\n**Slippage:**\nDifference between expected and actual price when swapping.\n- 0.5% = safe for liquid tokens\n- 1-2% = normal for most\n- 5%+ = high risk (rug territory)\n\n**Gas (Solana):**\n~0.00001 SOL per transaction\n(basically free compared to Ethereum)\n\n💡 Worker optimizes routes via Jupiter to minimize both!";
  }

  // General help
  if (lowerQuestion.includes("how") || lowerQuestion.includes("what") || lowerQuestion.includes("explain")) {
    return "I can help you understand:\n\n📊 **Metrics:**\n- ATH and missed profits\n- PnL calculations\n- Portfolio allocation\n\n🤖 **Worker:**\n- Automation strategies\n- Rule configuration\n- Risk management\n\n💡 **Trading:**\n- Take profit tactics\n- Rebalancing logic\n- Exit strategies\n\n🏆 **Leaderboard:**\n- Rank meanings\n- How to improve\n\nJust ask me anything specific!";
  }

  // Default response
  return `Interesting question! 🤔\n\nI'm still learning, but here's what I know:\n\n**About your question:**\n"${question}"\n\nCould you be more specific? For example:\n- \"Why did I miss so much on BONK?\"\n- \"What's ATH?\"\n- \"How does Worker help me?\"\n- \"Explain take profit strategies\"\n\nI'm here to make crypto less confusing! 🚀`;
}
