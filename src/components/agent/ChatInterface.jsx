
import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Loader2, User, Paperclip, Menu, AlertCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useElizaChat } from "@/hooks/useElizaChat";
import { Markdown } from "@/components/ui/Markdown";
import { AnimatedMarkdown } from "@/components/ui/AnimatedMarkdown";
import { Tool } from "@/components/ui/Tool";

export default function ChatInterface({ agent, channelId, onToggleSidebar }) {
  const { messages, isLoading, isAgentThinking, sendMessage, clearMessages, error, animatedMessageId } = useElizaChat({
    agentId: agent?.id,
    channelId,
  });
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isAgentThinking]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const messageContent = input;
    setInput("");

    try {
      await sendMessage(messageContent);
    } catch (error) {
      console.error('[ChatInterface] Error sending message:', error);
      // Error handling is done in the hook
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-black h-full w-full overflow-x-hidden">
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
          <div className="flex-1">
            <h2 className="text-base font-semibold text-white">{agent?.name || 'SENDO Agent'}</h2>
            <p className="text-xs text-[#14F195]">
              {isAgentThinking ? '● Thinking...' : '● Online'}
            </p>
          </div>

          {/* Clear messages button */}
          {messages.length > 0 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={clearMessages}
              className="text-white/60 hover:text-white hover:bg-white/5"
              style={{ borderRadius: 0 }}
              title="Clear conversation"
            >
              <Trash2 className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 p-4 flex items-center gap-3" style={{ borderRadius: 0 }}>
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        {messages.length === 0 && !error && (
          <div className="h-full flex items-center justify-center">
            <p className="text-white/40">No messages yet. Start the conversation!</p>
          </div>
        )}

        {messages
          .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
          .map((message) => {
          // Determine if message is from user or assistant
          const isUser = message.senderId !== agent?.id;
          const messageText = message.text || message.content || '';
          const messageTime = message.createdAt ? new Date(message.createdAt) : new Date();

          // Check if this is an action message
          const isActionMessage = message.type === 'agent_action' || message.source === 'agent_action';
          const rawMessage = message.rawMessage || {};

          // Mark as logged to avoid duplicate logs
          if (message.id && !message._logged) {
            message._logged = true;
          }

          // Helper function to convert action message to ToolPart format
          const convertToToolPart = (msg) => {
            const mapActionStatusToState = (status) => {
              switch (status) {
                case 'pending':
                case 'executing':
                case 'running':
                  return 'input-streaming';
                case 'completed':
                case 'success':
                  return 'output-available';
                case 'failed':
                case 'error':
                  return 'output-error';
                default:
                  return 'input-available';
              }
            };

            const actionName = rawMessage.actions?.[0] || rawMessage.action || 'ACTION';
            const actionStatus = rawMessage.actionStatus || 'completed';
            const actionId = rawMessage.actionId;

            const inputData = {};
            if (rawMessage.actions) inputData.actions = rawMessage.actions;
            if (rawMessage.action) inputData.action = rawMessage.action;
            if (rawMessage.thought) inputData.thought = rawMessage.thought;

            const outputData = {};
            if (rawMessage.text) outputData.result = rawMessage.text;
            if (actionStatus) outputData.status = actionStatus;
            if (rawMessage.thought) outputData.thought = rawMessage.thought;
            if (rawMessage.actionResult) outputData.actionResult = rawMessage.actionResult;

            const isError = actionStatus === 'failed' || actionStatus === 'error';
            const errorText = isError ? rawMessage.text || 'Action failed' : undefined;

            return {
              type: actionName,
              state: mapActionStatusToState(actionStatus),
              toolCallId: actionId,
              input: Object.keys(inputData).length > 0 ? inputData : undefined,
              output: Object.keys(outputData).length > 0 ? outputData : undefined,
              errorText,
            };
          };

          return (
            <div
              key={message.id}
              className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div className={`w-10 h-10 flex items-center justify-center flex-shrink-0 ${
                isUser
                  ? 'bg-white/10'
                  : 'bg-gradient-to-r from-[#FF5C1A] via-[#FF223B] to-[#30080C]'
              }`} style={{ borderRadius: 0 }}>
                {isUser ? (
                  <User className="w-5 h-5 text-white" />
                ) : (
                  <span className="text-lg">{agent?.avatar || '🔥'}</span>
                )}
              </div>

              <div className={`flex-1 max-w-[80%] ${isUser ? 'flex justify-end' : ''}`}>
                <div className={`p-4 ${
                  isUser
                    ? 'bg-gradient-to-r from-[#FF5C1A] via-[#FF223B] to-[#30080C] text-white'
                    : 'bg-white/5 text-white'
                }`} style={{ borderRadius: 0 }}>
                  {/* Display action tool if this is an action message */}
                  {isActionMessage ? (
                    <Tool
                      toolPart={convertToToolPart(message)}
                      defaultOpen={false}
                      className="max-w-none"
                    />
                  ) : (
                    <>
                      {/* Render message text with markdown support */}
                      {isUser ? (
                        <Markdown className="text-white">{messageText}</Markdown>
                      ) : (
                        <AnimatedMarkdown
                          className="text-white"
                          shouldAnimate={message.id === animatedMessageId}
                          messageId={message.id}
                          onUpdate={scrollToBottom}
                        >
                          {messageText}
                        </AnimatedMarkdown>
                      )}
                    </>
                  )}

                  <p className="text-xs mt-2 opacity-60">
                    {messageTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>
          );
        })}

        {/* Show typing indicator when agent is thinking */}
        {isAgentThinking && (
          <div className="flex gap-3 flex-row">
            <div className="w-10 h-10 flex items-center justify-center flex-shrink-0 bg-gradient-to-r from-[#FF5C1A] via-[#FF223B] to-[#30080C]" style={{ borderRadius: 0 }}>
              <span className="text-lg">{agent?.avatar || '🔥'}</span>
            </div>
            <div className="flex-1 max-w-[80%]">
              <div className="p-4 bg-white/5 text-white" style={{ borderRadius: 0 }}>
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-[#14F195]" />
                  <span className="text-white/60 text-sm">Thinking...</span>
                </div>
              </div>
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
