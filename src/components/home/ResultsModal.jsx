
import React from "react";
import { X, Twitter, Send, MessageCircle, ArrowRight, Sparkles, ExternalLink, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { createPageUrl } from "@/utils";

export default function ResultsModal({ isOpen, onClose, data }) {
  if (!data) return null;

  const generateShareImage = async () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 630;
    const ctx = canvas.getContext('2d');

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#1a1a1a');
    gradient.addColorStop(1, '#0a0a0a');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid pattern overlay
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += 60) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
    }
    for (let i = 0; i < canvas.height; i += 60) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();
    }

    // Load and draw character image
    const characterImg = new Image();
    characterImg.crossOrigin = "anonymous";
    
    return new Promise((resolve) => {
      characterImg.onload = () => {
        // Draw character on the right
        const charWidth = 400;
        const charHeight = 500;
        ctx.drawImage(characterImg, canvas.width - charWidth - 50, canvas.height - charHeight + 50, charWidth, charHeight);

        // Title
        ctx.font = 'bold 48px Arial';
        ctx.fillStyle = '#ffffff';
        ctx.fillText('I MISSED AT ATH', 60, 100);

        // Main amount with gradient
        ctx.font = 'bold 120px Arial';
        const amountGradient = ctx.createLinearGradient(60, 150, 60, 270);
        amountGradient.addColorStop(0, '#FF5C1A');
        amountGradient.addColorStop(1, '#FF223B'); // Updated gradient color
        ctx.fillStyle = amountGradient;
        ctx.fillText(`$${data.totalMissed.toLocaleString()}`, 60, 250);

        // Subtitle
        ctx.font = '24px Arial';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.fillText('by not selling at the right time... 💎🙌', 60, 300);

        // Top losses
        ctx.font = 'bold 20px Arial';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fillText('TOP PAIN POINTS:', 60, 370);

        let yOffset = 420;
        data.topMisses.slice(0, 3).forEach((miss, index) => {
          // Token badge
          ctx.fillStyle = '#FF5C1A'; // Keeping the 'from' color for consistency with the new gradient scheme
          ctx.fillRect(60, yOffset - 25, 40, 40);
          
          ctx.font = 'bold 20px Arial';
          ctx.fillStyle = '#ffffff';
          ctx.fillText(`${index + 1}`, 75, yOffset);

          // Token name
          ctx.font = 'bold 22px Arial';
          ctx.fillStyle = '#ffffff';
          ctx.fillText(miss.token, 120, yOffset);

          // Loss amount
          ctx.font = 'bold 24px Arial';
          ctx.fillStyle = '#FF223B'; // Updated color
          ctx.fillText(`-$${miss.missed.toLocaleString()}`, 250, yOffset);

          yOffset += 60;
        });

        // Footer
        ctx.font = 'bold 32px Arial';
        ctx.fillStyle = '#ffffff';
        ctx.fillText('sendo.io', 60, canvas.height - 40);

        // Convert to blob and download
        canvas.toBlob((blob) => {
          const url = URL.createObjectURL(blob);
          resolve(url);
        });
      };

      characterImg.src = 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68de5637652a326681f5a5a3/71520e59a_sendo-laught.png';
    });
  };

  const handleShare = async (platform) => {
    // Generate and download image
    const imageUrl = await generateShareImage();
    const link = document.createElement('a');
    link.download = 'sendo-losses.png';
    link.href = imageUrl;
    link.click();
    URL.revokeObjectURL(imageUrl);

    // Open social media
    const message = `I missed $${data.totalMissed.toLocaleString()} by not selling at ATH! 😭\n\nCheck your losses at sendo.io`;
    const encodedMessage = encodeURIComponent(message);
    
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodedMessage}`,
      telegram: `https://t.me/share/url?url=sendo.io&text=${encodedMessage}`,
      discord: `https://discord.com/channels/@me`
    };
    
    if (urls[platform]) {
      setTimeout(() => {
        window.open(urls[platform], '_blank');
      }, 500);
    }
  };

  const handleFullAnalysis = () => {
    window.open(createPageUrl("Dashboard"), '_blank');
  };

  const handleImproveWithAgent = () => {
    window.location.href = createPageUrl("Agent") + "?action=scan&wallet=" + encodeURIComponent(data.wallet);
  };

  const handleGoToAgents = () => {
    window.location.href = createPageUrl("Marketplace");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl bg-[#0A0A0A] border-2 border-[#FF5C1A]/30 p-0 overflow-hidden max-h-[90vh] overflow-y-auto" style={{ borderRadius: 0 }}>
        <div className="relative">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-50 w-10 h-10 bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
            style={{ borderRadius: 0 }}
          >
            <X className="w-5 h-5 text-white" />
          </button>

          <div className="grid md:grid-cols-2 gap-0">
            {/* Left side - Data */}
            <div className="p-8 md:p-10">
              <div className="mb-8">
                <p className="text-white/60 text-sm uppercase tracking-wider mb-2">Total Missed at ATH</p>
                <div className="text-4xl md:text-5xl lg:text-6xl font-bold mb-2">
                  <span className="bg-gradient-to-r from-[#FF5C1A] via-[#FF223B] to-[#30080C] bg-clip-text text-transparent">
                    ${data.totalMissed.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </span>
                </div>
                <p className="text-white/40 text-sm">You could've been rich... 💎🙌</p>
              </div>

              {/* Top Losses */}
              <div className="space-y-3 mb-8">
                <h3 className="text-white/80 text-sm uppercase tracking-wider mb-4">Top Pain Points</h3>
                {data.topMisses.map((miss, index) => (
                  <div
                    key={index}
                    className="bg-white/5 border border-white/10 p-4 hover:bg-white/10 transition-colors"
                    style={{ borderRadius: 0 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-[#FF5C1A] via-[#FF223B] to-[#30080C] flex items-center justify-center font-bold text-white text-sm" style={{ borderRadius: 0 }}>
                          {index + 1}
                        </div>
                        <div>
                          <p className="text-white font-semibold">{miss.token}</p>
                          <p className="text-white/50 text-xs">ATH: ${miss.ath} • Sold: ${miss.soldAt}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[#FF223B] font-bold text-lg">-${miss.missed.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 mb-6">
                <Button
                  onClick={handleFullAnalysis}
                  className="w-full h-12 bg-gradient-to-r from-[#FF5C1A] via-[#FF223B] to-[#30080C] hover:shadow-lg hover:shadow-[#FF5C1A]/50 transition-all text-white font-semibold"
                  style={{ borderRadius: 0 }}
                >
                  <ExternalLink className="w-4 h-4 mr-1.5" />
                  Full Analysis
                </Button>
                
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={handleImproveWithAgent}
                    className="h-12 bg-gradient-to-r from-[#14F195] to-[#00D9B5] hover:shadow-lg hover:shadow-[#14F195]/50 transition-all text-black font-semibold"
                    style={{ borderRadius: 0 }}
                  >
                    <Bot className="w-4 h-4 mr-1.5" />
                    I want to improve this!
                  </Button>

                  <Button
                    onClick={handleGoToAgents}
                    className="h-12 border-2 border-[#FF5C1A] text-[#FF5C1A] bg-transparent hover:bg-[#FF5C1A] hover:text-white transition-all font-semibold"
                    style={{ borderRadius: 0 }}
                  >
                    <Sparkles className="w-4 h-4 mr-1.5" />
                    Our Plugins
                  </Button>
                </div>
              </div>

              {/* Share Buttons */}
              <div>
                <h3 className="text-white/80 text-sm uppercase tracking-wider mb-3">Share Your Pain</h3>
                <div className="grid grid-cols-3 gap-3">
                  <Button
                    onClick={() => handleShare('twitter')}
                    className="h-12 bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white"
                    style={{ borderRadius: 0 }}
                  >
                    <Twitter className="w-5 h-5" />
                  </Button>
                  <Button
                    onClick={() => handleShare('telegram')}
                    className="h-12 bg-[#0088cc] hover:bg-[#0077b3] text-white"
                    style={{ borderRadius: 0 }}
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                  <Button
                    onClick={() => handleShare('discord')}
                    className="h-12 bg-[#5865F2] hover:bg-[#4752c4] text-white"
                    style={{ borderRadius: 0 }}
                  >
                    <MessageCircle className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Right side - Character */}
            <div className="relative bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] flex items-end justify-center overflow-hidden">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50" />
              <img
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68de5637652a326681f5a5a3/71520e59a_sendo-laught.png"
                alt="SENDO Character"
                className="relative z-10 w-full max-w-md object-contain"
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
