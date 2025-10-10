import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Brain, Store, Zap, Sparkles, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Search,
    title: "ANALYZE YOUR WALLET",
    description: "Give us your Solana address. We scan your entire on-chain history — every trade, every token, every mistake. See exactly how much you lost by not selling at ATH.",
    highlight: "No judgment — just data, transparency, and insights.",
    imagePlaceholder: "wallet-analysis-illustration.png"
  },
  {
    number: "02",
    icon: Brain,
    title: "CREATE YOUR OWN AGENTAI",
    description: "Build your personal trading AgentAI from your analysis. It learns from your on-chain memory, builds your trading profile, and evolves with your strategies. Your wallet, your data, your rules.",
    highlight: "Your Agent belongs only to you — forever.",
    imagePlaceholder: "agent-creation-illustration.png"
  },
  {
    number: "03",
    icon: Store,
    title: "EXPLORE THE MARKETPLACE",
    description: "Access the best tools through our open marketplace of plugins. Each plugin is tracked and rated on-chain based on community votes, performance, and active users.",
    highlight: "Transparent and trustless — no more fake bots.",
    imagePlaceholder: "marketplace-illustration.png"
  },
  {
    number: "04",
    icon: Zap,
    title: "TRADE SMARTER, OWN EVERYTHING",
    description: "Your AgentAI guides you in real time and will soon trade for you — fully automated, fully personalized. Keep your privacy and data ownership intact.",
    highlight: "Run on our cloud or on your own computer.",
    imagePlaceholder: "trading-automation-illustration.png"
  },
  {
    number: "05",
    icon: Sparkles,
    title: "THE FUTURE IS AGENTIC",
    description: "The next generation of finance will be powered by AI agents. Each investor, protocol, and fund will have their own AgentAI, all connected and competing to offer you the best opportunities.",
    highlight: "You're building your digital twin in the markets.",
    imagePlaceholder: "agentic-future-illustration.png"
  }
];

export default function HowItWorksSection() {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    setCurrentStep((prev) => (prev + 1) % steps.length);
  };

  const prevStep = () => {
    setCurrentStep((prev) => (prev - 1 + steps.length) % steps.length);
  };

  const step = steps[currentStep];

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center bg-black py-16 md:py-0 overflow-hidden">
      <div className="max-w-[1400px] mx-auto w-full px-4 sm:px-6">
        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-3 sm:mb-4 md:mb-6 text-white"
          style={{ fontFamily: 'TECHNOS, sans-serif' }}
        >
          HOW IT{" "}
          <span className="bg-gradient-to-r from-[#FF5C1A] via-[#FF223B] to-[#30080C] bg-clip-text text-transparent">
            WORKS
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-base sm:text-lg md:text-xl text-white/60 text-center mb-8 sm:mb-12 md:mb-16"
        >
          From wallet analysis to autonomous trading — your journey in 5 steps
        </motion.p>

        {/* Desktop: Slider horizontal */}
        <div className="hidden md:block">
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center"
              >
                {/* Content Side */}
                <div className="order-2 md:order-1">
                  <div className="relative bg-white/5 border border-white/10 p-8 lg:p-10 hover:bg-white/10 hover:border-[#FF5C1A]/50 transition-all group" style={{ borderRadius: 0 }}>
                    {/* Number Badge */}
                    <div className="absolute -top-6 -left-6 w-20 h-20 bg-gradient-to-r from-[#FF5C1A] via-[#FF223B] to-[#30080C] flex items-center justify-center group-hover:scale-110 transition-transform" 
                         style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%)' }}>
                      <span className="text-3xl font-bold text-white" style={{ fontFamily: 'TECHNOS, sans-serif' }}>{step.number}</span>
                    </div>

                    {/* Icon */}
                    <div className="w-16 h-16 bg-black border border-[#FF5C1A]/30 flex items-center justify-center mb-6 ml-10" 
                         style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)' }}>
                      <step.icon className="w-8 h-8 text-[#FF5C1A]" />
                    </div>

                    {/* Title */}
                    <h3 
                      className="text-2xl lg:text-3xl font-bold text-white mb-4"
                      style={{ fontFamily: 'TECHNOS, sans-serif' }}
                    >
                      {step.title}
                    </h3>

                    {/* Description */}
                    <p className="text-base lg:text-lg text-white/70 leading-relaxed mb-6">
                      {step.description}
                    </p>

                    {/* Highlight */}
                    <div className="bg-gradient-to-r from-[#FF5C1A]/10 to-transparent border-l-4 border-[#FF5C1A] pl-4 py-3">
                      <p className="text-base lg:text-lg text-white/90 font-semibold italic">
                        {step.highlight}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Image Placeholder Side */}
                <div className="order-1 md:order-2">
                  <div className="relative aspect-square bg-white/5 border border-white/10 flex items-center justify-center group hover:border-[#FF5C1A]/50 transition-all" style={{ borderRadius: 0 }}>
                    <div className="text-center p-8">
                      <div className="w-24 h-24 bg-gradient-to-r from-[#FF5C1A] via-[#FF223B] to-[#30080C] flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform" 
                           style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%)' }}>
                        <step.icon className="w-12 h-12 text-white" />
                      </div>
                      <p className="text-white/40 text-sm font-mono mb-2">Image Placeholder</p>
                      <p className="text-white/60 text-xs">{step.imagePlaceholder}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={prevStep}
                className="w-14 h-14 bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 hover:border-[#FF5C1A]/50 transition-all group"
                style={{ borderRadius: 0 }}
              >
                <ChevronLeft className="w-6 h-6 text-white group-hover:text-[#FF5C1A] transition-colors" />
              </button>

              {/* Step Indicators */}
              <div className="flex gap-2">
                {steps.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentStep(index)}
                    className={`h-2 transition-all ${
                      index === currentStep 
                        ? "w-8 bg-gradient-to-r from-[#FF5C1A] via-[#FF223B] to-[#30080C]" 
                        : "w-2 bg-white/20 hover:bg-white/40"
                    }`}
                    style={{ borderRadius: 0 }}
                  />
                ))}
              </div>

              <button
                onClick={nextStep}
                className="w-14 h-14 bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 hover:border-[#FF5C1A]/50 transition-all group"
                style={{ borderRadius: 0 }}
              >
                <ChevronRight className="w-6 h-6 text-white group-hover:text-[#FF5C1A] transition-colors" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile: Scroll vertical simple */}
        <div className="md:hidden space-y-8">
          {steps.map((mobileStep, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="space-y-4"
            >
              {/* Image Placeholder */}
              <div className="relative aspect-square bg-white/5 border border-white/10 flex items-center justify-center" style={{ borderRadius: 0 }}>
                <div className="text-center p-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-[#FF5C1A] via-[#FF223B] to-[#30080C] flex items-center justify-center mx-auto mb-3" 
                       style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)' }}>
                    <mobileStep.icon className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-white/40 text-xs font-mono mb-1">Image Placeholder</p>
                  <p className="text-white/60 text-[10px]">{mobileStep.imagePlaceholder}</p>
                </div>
              </div>

              {/* Content */}
              <div className="relative bg-white/5 border border-white/10 p-6" style={{ borderRadius: 0 }}>
                {/* Number Badge */}
                <div className="absolute -top-4 -left-4 w-14 h-14 bg-gradient-to-r from-[#FF5C1A] via-[#FF223B] to-[#30080C] flex items-center justify-center" 
                     style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)' }}>
                  <span className="text-xl font-bold text-white" style={{ fontFamily: 'TECHNOS, sans-serif' }}>{mobileStep.number}</span>
                </div>

                {/* Icon */}
                <div className="w-12 h-12 bg-black border border-[#FF5C1A]/30 flex items-center justify-center mb-4 ml-8" 
                     style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)' }}>
                  <mobileStep.icon className="w-6 h-6 text-[#FF5C1A]" />
                </div>

                {/* Title */}
                <h3 
                  className="text-lg font-bold text-white mb-3"
                  style={{ fontFamily: 'TECHNOS, sans-serif' }}
                >
                  {mobileStep.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-white/70 leading-relaxed mb-3">
                  {mobileStep.description}
                </p>

                {/* Highlight */}
                <div className="bg-gradient-to-r from-[#FF5C1A]/10 to-transparent border-l-2 border-[#FF5C1A] pl-3 py-2">
                  <p className="text-sm text-white/90 font-semibold italic">
                    {mobileStep.highlight}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-12 md:mt-16 text-center"
        >
          <p className="text-white/60 text-sm sm:text-base md:text-lg mb-4">
            Ready to build your trading future?
          </p>
          <div className="inline-block bg-gradient-to-r from-[#FF5C1A] via-[#FF223B] to-[#30080C] p-[2px] hover:shadow-lg hover:shadow-[#FF5C1A]/50 transition-all cursor-pointer group" 
               style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)' }}>
            <div className="bg-black px-6 py-3 hover:bg-transparent transition-all flex items-center gap-2" 
                 style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)' }}>
              <span className="text-white font-bold text-sm sm:text-base" style={{ fontFamily: 'TECHNOS, sans-serif' }}>START NOW</span>
              <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}