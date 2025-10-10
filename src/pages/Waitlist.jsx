import React, { useState } from "react";
import { motion } from "framer-motion";
import { Send, Check, AlertCircle, Sparkles, Zap, Brain } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function Waitlist() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    setError("");

    try {
      // Vérifier si l'email existe déjà
      const existing = await base44.entities.Waitlist.filter({ email: email.toLowerCase() });
      
      if (existing.length > 0) {
        setError("This email is already on the waitlist!");
        setIsSubmitting(false);
        return;
      }

      // Créer l'entrée dans la waitlist
      await base44.entities.Waitlist.create({
        email: email.toLowerCase(),
        referral_source: document.referrer || "direct"
      });

      setIsSuccess(true);
      setEmail("");
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FF5C1A]/10 via-black to-[#FF223B]/10" />
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50" />

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 py-12">
        <div className="max-w-4xl w-full">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8"
          >
            <Link to={createPageUrl("Home")}>
              <img
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68de5637652a326681f5a5a3/6ee61bcb6_SENDO_white2x.png"
                alt="SENDO"
                className="h-8 sm:h-10 mx-auto mb-4"
              />
            </Link>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-white"
              style={{ fontFamily: 'TECHNOS, sans-serif' }}
            >
              THE FUTURE OF{" "}
              <span className="bg-gradient-to-r from-[#FF5C1A] via-[#FF223B] to-[#30080C] bg-clip-text text-transparent">
                CRYPTO TRADING
              </span>
            </h1>

            <p className="text-lg sm:text-xl md:text-2xl text-white/80 mb-8 max-w-2xl mx-auto">
              Stop bagholding. Create your own AI agent that learns from your mistakes and trades smarter.
            </p>

            {/* Features Grid */}
            <div className="grid sm:grid-cols-3 gap-4 mb-12 max-w-3xl mx-auto">
              <div className="bg-white/5 border border-white/10 p-4 sm:p-6" style={{ borderRadius: 0 }}>
                <div className="w-12 h-12 bg-gradient-to-r from-[#FF5C1A] via-[#FF223B] to-[#30080C] flex items-center justify-center mx-auto mb-3" style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)' }}>
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white font-bold mb-2" style={{ fontFamily: 'TECHNOS, sans-serif' }}>PERSONAL AI</h3>
                <p className="text-white/60 text-sm">Your agent learns from your trading history</p>
              </div>

              <div className="bg-white/5 border border-white/10 p-4 sm:p-6" style={{ borderRadius: 0 }}>
                <div className="w-12 h-12 bg-gradient-to-r from-[#FF5C1A] via-[#FF223B] to-[#30080C] flex items-center justify-center mx-auto mb-3" style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)' }}>
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white font-bold mb-2" style={{ fontFamily: 'TECHNOS, sans-serif' }}>AUTOMATED</h3>
                <p className="text-white/60 text-sm">Trade 24/7 with your personalized strategy</p>
              </div>

              <div className="bg-white/5 border border-white/10 p-4 sm:p-6" style={{ borderRadius: 0 }}>
                <div className="w-12 h-12 bg-gradient-to-r from-[#FF5C1A] via-[#FF223B] to-[#30080C] flex items-center justify-center mx-auto mb-3" style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)' }}>
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white font-bold mb-2" style={{ fontFamily: 'TECHNOS, sans-serif' }}>OPEN SOURCE</h3>
                <p className="text-white/60 text-sm">Run on cloud or your own machine</p>
              </div>
            </div>
          </motion.div>

          {/* Waitlist Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="max-w-2xl mx-auto"
          >
            {!isSuccess ? (
              <div className="bg-white/5 border border-white/10 p-6 sm:p-8" style={{ borderRadius: 0 }}>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 text-center" style={{ fontFamily: 'TECHNOS, sans-serif' }}>
                  JOIN THE{" "}
                  <span className="bg-gradient-to-r from-[#FF5C1A] via-[#FF223B] to-[#30080C] bg-clip-text text-transparent">
                    WAITLIST
                  </span>
                </h2>
                <p className="text-white/60 text-center mb-6">
                  Be among the first to access SENDO when we launch
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-14 text-lg bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-[#FF5C1A]"
                    style={{ borderRadius: 0 }}
                    required
                    disabled={isSubmitting}
                  />

                  {error && (
                    <div className="flex items-center gap-2 text-[#FF223B] text-sm">
                      <AlertCircle className="w-4 h-4" />
                      {error}
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={isSubmitting || !email.trim()}
                    className="w-full h-14 text-lg font-bold bg-gradient-to-r from-[#FF5C1A] via-[#FF223B] to-[#30080C] hover:shadow-lg hover:shadow-[#FF5C1A]/50 transition-all"
                    style={{ 
                      clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)',
                      borderRadius: 0
                    }}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        JOINING...
                      </div>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        JOIN WAITLIST
                      </>
                    )}
                  </Button>
                </form>

                <p className="text-white/40 text-xs text-center mt-4">
                  We'll notify you as soon as SENDO launches. No spam, promise.
                </p>
              </div>
            ) : (
              <div className="bg-gradient-to-r from-[#14F195]/10 to-transparent border border-[#14F195]/30 p-8 text-center" style={{ borderRadius: 0 }}>
                <div className="w-16 h-16 bg-[#14F195] flex items-center justify-center mx-auto mb-4" style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)' }}>
                  <Check className="w-8 h-8 text-black" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4" style={{ fontFamily: 'TECHNOS, sans-serif' }}>
                  YOU'RE ON THE LIST!
                </h2>
                <p className="text-white/80 mb-6">
                  We'll let you know when SENDO is ready to revolutionize your trading.
                </p>
                <Link to={createPageUrl("Home")}>
                  <Button
                    className="bg-white/10 hover:bg-white/20 text-white border-none"
                    style={{ borderRadius: 0 }}
                  >
                    Back to Home
                  </Button>
                </Link>
              </div>
            )}
          </motion.div>

          {/* Footer Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-center mt-12 space-y-4"
          >
            <div className="flex justify-center gap-6 text-white/60 text-sm">
              <Link to={createPageUrl("Home")} className="hover:text-white transition-colors">
                Home
              </Link>
              <Link to={createPageUrl("Dashboard")} className="hover:text-white transition-colors">
                Dashboard
              </Link>
              <Link to={createPageUrl("Marketplace")} className="hover:text-white transition-colors">
                Marketplace
              </Link>
            </div>
            <p className="text-white/40 text-xs">
              © 2025 SENDO. Built by degens, for degens.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}