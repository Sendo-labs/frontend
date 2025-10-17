import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Eye, EyeOff, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ConfigurePluginModal({ plugin, onClose, onComplete }) {
  const [formData, setFormData] = useState({});
  const [showPassword, setShowPassword] = useState({});

  const isOAuth = plugin.authType === "oauth";

  const handleOAuthConnect = () => {
    // Mock OAuth flow
    console.log("Opening OAuth window for:", plugin.name);
    setTimeout(() => {
      onComplete();
    }, 1500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Deploying plugin with config:", formData);
    onComplete();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-[#0D0D0D] border-2 border-[#FF6B00]/30 max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
          style={{ borderRadius: 0 }}
        >
          {/* Header */}
          <div className="border-b border-[#F2EDE7]/10 p-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-gradient-to-r from-[#FF6B00] to-[#FF223B] flex items-center justify-center text-4xl flex-shrink-0" style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)' }}>
                {plugin.icon}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2 uppercase" style={{ fontFamily: 'TECHNOS, sans-serif' }}>
                  CONFIGURE <span className="text-[#FF6B00]">{plugin.name}</span>
                </h2>
                <p className="text-[#F2EDE7]/60 text-sm">
                  {isOAuth 
                    ? "Connect your account to deploy this plugin"
                    : "Fill in the required parameters to deploy this plugin"
                  }
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 bg-[#F2EDE7]/5 hover:bg-[#F2EDE7]/10 flex items-center justify-center flex-shrink-0"
                style={{ borderRadius: 0 }}
              >
                <X className="w-6 h-6 text-[#F2EDE7]/60" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {isOAuth ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-[#FF6B00] to-[#FF223B] flex items-center justify-center text-5xl" style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%)' }}>
                  {plugin.icon}
                </div>
                <h3 className="text-xl font-bold text-[#F2EDE7] mb-3 uppercase" style={{ fontFamily: 'TECHNOS, sans-serif' }}>
                  CONNECT TO {plugin.name.toUpperCase()}
                </h3>
                <p className="text-[#F2EDE7]/60 mb-8 max-w-md mx-auto">
                  You'll be redirected to {plugin.name} to authorize sEnDO to access your account.
                </p>
                <div className="space-y-4 max-w-sm mx-auto">
                  <div className="flex items-start gap-3 text-left">
                    <CheckCircle className="w-5 h-5 text-[#14F195] flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-[#F2EDE7]/70">Secure OAuth 2.0 authentication</p>
                  </div>
                  <div className="flex items-start gap-3 text-left">
                    <CheckCircle className="w-5 h-5 text-[#14F195] flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-[#F2EDE7]/70">sEnDO never stores your credentials</p>
                  </div>
                  <div className="flex items-start gap-3 text-left">
                    <CheckCircle className="w-5 h-5 text-[#14F195] flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-[#F2EDE7]/70">Revoke access anytime</p>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {plugin.configFields && plugin.configFields.map((field) => (
                  <div key={field.name}>
                    <label className="block mb-2">
                      <span className="text-[#F2EDE7] font-bold text-sm uppercase">
                        {field.label} {field.required && <span className="text-[#FF223B]">*</span>}
                      </span>
                      {field.description && (
                        <span className="block text-[#F2EDE7]/60 text-xs mt-1">
                          {field.description}
                        </span>
                      )}
                    </label>
                    
                    <div className="relative">
                      <Input
                        type={field.type === "password" && !showPassword[field.name] ? "password" : field.type}
                        placeholder={field.default ? `Default: ${field.default}` : `Enter ${field.label.toLowerCase()}`}
                        value={formData[field.name] || ""}
                        onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                        required={field.required}
                        className="bg-[#F2EDE7]/5 border-[#F2EDE7]/20 text-[#F2EDE7] h-12"
                        style={{ borderRadius: 0 }}
                      />
                      
                      {field.type === "password" && (
                        <button
                          type="button"
                          onClick={() => setShowPassword({ ...showPassword, [field.name]: !showPassword[field.name] })}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#F2EDE7]/40 hover:text-[#F2EDE7]/70"
                        >
                          {showPassword[field.name] ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {(!plugin.configFields || plugin.configFields.length === 0) && (
                  <div className="text-center py-8">
                    <p className="text-[#F2EDE7]/60">No configuration required. Ready to deploy!</p>
                  </div>
                )}
              </form>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-[#F2EDE7]/10 p-6">
            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={onClose}
                className="bg-[#F2EDE7]/5 border border-[#F2EDE7]/10 hover:bg-[#F2EDE7]/10 text-[#F2EDE7] h-12 uppercase"
                style={{ borderRadius: 0 }}
              >
                Cancel
              </Button>
              <Button
                onClick={isOAuth ? handleOAuthConnect : handleSubmit}
                type={isOAuth ? "button" : "submit"}
                className="bg-gradient-to-r from-[#FF6B00] to-[#FF223B] hover:shadow-lg hover:shadow-[#FF223B]/50 text-white h-12 uppercase"
                style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)', borderRadius: 0 }}
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                {isOAuth ? "Connect & Deploy" : "Deploy Plugin"}
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}