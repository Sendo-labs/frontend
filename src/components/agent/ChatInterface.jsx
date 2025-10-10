
import React, { useState, useRef, useEffect } from "react";
import { Send, Loader2, User, Paperclip, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { InvokeLLM } from "@/api/integrations";

export default function ChatInterface({ agent, onToggleSidebar }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "assistant",
      content: `Hey! I'm ${agent?.name || 'SENDO Agent'}. ${agent?.description || 'I can help you with crypto analysis.'}`,
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await InvokeLLM({
        prompt: `You are ${agent?.name || 'SENDO Agent'}, ${agent?.description || 'a helpful crypto AI assistant'}. 
        
User message: ${input}

Respond in a helpful, professional way that matches your character.`,
        add_context_from_internet: false,
      });

      const assistantMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-black h-full">
      {/* Header */}
      <div className="border-b border-white/10 p-4 bg-[#0A0A0A]">
        <div className="flex items-center gap-3">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className="md:hidden text-white flex-shrink-0"
            style={{ borderRadius: 0 }}
          >
            <Menu className="w-5 h-5" />
          </Button>

          <div className="w-10 h-10 bg-gradient-to-r from-[#FF5C1A] via-[#FF223B] to-[#30080C] flex items-center justify-center text-lg flex-shrink-0" style={{ borderRadius: 0 }}>
            {agent?.avatar || '🔥'}
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">{agent?.name || 'SENDO Agent'}</h2>
            <p className="text-xs text-[#14F195]">● Online</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 && (
          <div className="h-full flex items-center justify-center">
            <p className="text-white/40">No messages yet. Start the conversation!</p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <div className={`w-10 h-10 flex items-center justify-center flex-shrink-0 ${
              message.role === 'user'
                ? 'bg-white/10'
                : 'bg-gradient-to-r from-[#FF5C1A] via-[#FF223B] to-[#30080C]'
            }`} style={{ borderRadius: 0 }}>
              {message.role === 'user' ? (
                <User className="w-5 h-5 text-white" />
              ) : (
                <span className="text-lg">{agent?.avatar || '🔥'}</span>
              )}
            </div>

            <div className={`flex-1 max-w-[80%] ${message.role === 'user' ? 'flex justify-end' : ''}`}>
              <div className={`p-4 ${
                message.role === 'user'
                  ? 'bg-gradient-to-r from-[#FF5C1A] via-[#FF223B] to-[#30080C] text-white'
                  : 'bg-white/5 text-white'
              }`} style={{ borderRadius: 0 }}>
                <p className="whitespace-pre-wrap break-words">{message.content}</p>
                <p className="text-xs mt-2 opacity-60">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-[#FF5C1A] via-[#FF223B] to-[#30080C] flex items-center justify-center flex-shrink-0" style={{ borderRadius: 0 }}>
              <span className="text-lg">{agent?.avatar || '🔥'}</span>
            </div>
            <div className="bg-white/5 p-4" style={{ borderRadius: 0 }}>
              <Loader2 className="w-5 h-5 animate-spin text-white/60" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-white/10 p-4 bg-[#0A0A0A]">
        <div className="flex items-start gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="text-white/40 hover:text-white flex-shrink-0 mt-1"
            style={{ borderRadius: 0 }}
          >
            <Paperclip className="w-5 h-5" />
          </Button>
          
          <div className="flex-1">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Message..."
              className="bg-white/5 border-white/10 text-white placeholder:text-white/30 resize-none min-h-0"
              disabled={isLoading}
              rows={2}
              style={{ borderRadius: 0 }}
            />
            <p className="text-xs text-white/40 mt-2">
              Press Enter to send • Shift+Enter for new line
            </p>
          </div>
          
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            size="icon"
            className="bg-gradient-to-r from-[#FF5C1A] via-[#FF223B] to-[#30080C] hover:shadow-lg hover:shadow-[#FF5C1A]/50 flex-shrink-0 h-10 w-10 mt-1"
            style={{ borderRadius: 0 }}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
