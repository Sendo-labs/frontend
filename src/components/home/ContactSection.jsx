
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Send, Twitter, MessageCircle, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ContactSection() {
  const [formData, setFormData] = useState({
    email: "",
    message: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setFormData({ email: "", message: "" });
  };

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center bg-[#0D0D0D] py-16 md:py-0 overflow-hidden">
      <div className="max-w-[1400px] mx-auto w-full px-4 sm:px-6">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-3 sm:mb-4 md:mb-6 text-[#F2EDE7]"
          style={{ fontFamily: 'TECHNOS, sans-serif' }}
        >
          GET IN{" "}
          <span className="bg-gradient-to-r from-[#FF6B00] to-[#FF223B] bg-clip-text text-transparent">
            TOUCH
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-base sm:text-lg md:text-xl text-[#F2EDE7]/60 text-center mb-8 sm:mb-12"
        >
          Join the community or reach out to us
        </motion.p>

        <div className="grid md:grid-cols-2 gap-8 sm:gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div>
                <Input
                  type="email"
                  placeholder="Your email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="h-12 sm:h-14 bg-[#F2EDE7]/5 border-[#F2EDE7]/20 text-[#F2EDE7] placeholder:text-[#F2EDE7]/40 focus:border-[#FF6B00]"
                  style={{ borderRadius: 0 }}
                  required
                />
              </div>
              <div>
                <Textarea
                  placeholder="Your message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="min-h-24 sm:min-h-32 bg-[#F2EDE7]/5 border-[#F2EDE7]/20 text-[#F2EDE7] placeholder:text-[#F2EDE7]/40 focus:border-[#FF6B00] resize-none"
                  style={{ borderRadius: 0 }}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full h-12 sm:h-14 text-base sm:text-lg font-bold bg-gradient-to-r from-[#FF6B00] via-[#FF223B] to-[#FF6B00] hover:shadow-lg hover:shadow-[#FF223B]/50 transition-all"
                style={{ fontFamily: 'TECHNOS, sans-serif', clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)', borderRadius: 0 }}
              >
                <Send className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                SEND MESSAGE
              </Button>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="flex flex-col justify-center"
          >
            <h3 className="text-xl sm:text-2xl font-bold text-[#F2EDE7] mb-4 sm:mb-6" style={{ fontFamily: 'TECHNOS, sans-serif' }}>
              FOLLOW US
            </h3>
            
            <div className="space-y-3 sm:space-y-4">
              <a
                href="#"
                className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-[#F2EDE7]/5 border border-[#F2EDE7]/10 hover:bg-[#F2EDE7]/10 hover:border-[#FF6B00]/50 transition-all group"
                style={{ borderRadius: 0 }}
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-[#FF6B00] via-[#FF223B] to-[#FF6B00] flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0"
                     style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)' }}>
                  <Twitter className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <p className="text-[#F2EDE7] font-semibold text-sm sm:text-base">Twitter / X</p>
                  <p className="text-[#F2EDE7]/60 text-xs sm:text-sm">@sendo_agent</p>
                </div>
              </a>

              <a
                href="#"
                className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-[#F2EDE7]/5 border border-[#F2EDE7]/10 hover:bg-[#F2EDE7]/10 hover:border-[#FF6B00]/50 transition-all group"
                style={{ borderRadius: 0 }}
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-[#FF6B00] via-[#FF223B] to-[#FF6B00] flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0"
                     style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)' }}>
                  <Send className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <p className="text-[#F2EDE7] font-semibold text-sm sm:text-base">Telegram</p>
                  <p className="text-[#F2EDE7]/60 text-xs sm:text-sm">t.me/sendo_official</p>
                </div>
              </a>

              <a
                href="#"
                className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-[#F2EDE7]/5 border border-[#F2EDE7]/10 hover:bg-[#F2EDE7]/10 hover:border-[#FF6B00]/50 transition-all group"
                style={{ borderRadius: 0 }}
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-[#FF6B00] via-[#FF223B] to-[#FF6B00] flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0"
                     style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)' }}>
                  <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <p className="text-[#F2EDE7] font-semibold text-sm sm:text-base">Discord</p>
                  <p className="text-[#F2EDE7]/60 text-xs sm:text-sm">discord.gg/sendo</p>
                </div>
              </a>

              <a
                href="mailto:contact@sendo.io"
                className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-[#F2EDE7]/5 border border-[#F2EDE7]/10 hover:bg-[#F2EDE7]/10 hover:border-[#FF6B00]/50 transition-all group"
                style={{ borderRadius: 0 }}
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-[#FF6B00] via-[#FF223B] to-[#FF6B00] flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0"
                     style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)' }}>
                  <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <p className="text-[#F2EDE7] font-semibold text-sm sm:text-base">Email</p>
                  <p className="text-[#F2EDE7]/60 text-xs sm:text-sm">contact@sendo.io</p>
                </div>
              </a>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-12 sm:mt-16 text-center text-[#F2EDE7]/40 text-xs sm:text-sm px-4"
        >
          <p>© 2025 sEnDO. All rights reserved.</p>
          <p className="mt-2">Built by degens, for degens.</p>
        </motion.div>
      </div>
    </section>
  );
}
