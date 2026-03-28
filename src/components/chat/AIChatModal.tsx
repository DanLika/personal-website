import { useState, useRef, useEffect, useCallback } from "react";
import { X, Send, MessageCircle, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  sendMessageToGemini,
  isGeminiConfigured,
  type ChatMessage,
} from "../../services/geminiService";
import {
  INITIAL_SUGGESTIONS,
  CHAT_INITIAL_MESSAGE,
} from "../../config/aiSystemPrompt";

interface AIChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIChatModal = ({ isOpen, onClose }: AIChatModalProps) => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language === "bs" ? "bs" : "en";

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showInitial, setShowInitial] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Reset chat when modal closes
  useEffect(() => {
    if (!isOpen) {
      setMessages([]);
      setShowInitial(true);
      setInputValue("");
    }
  }, [isOpen]);

  // Disable body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Save and restore focus when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
    } else if (previousFocusRef.current) {
      previousFocusRef.current.focus();
      previousFocusRef.current = null;
    }
  }, [isOpen]);

  // Focus trap - keep Tab cycling within the modal
  const handleFocusTrap = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
      return;
    }
    if (e.key !== "Tab" || !modalRef.current) return;

    const focusable = modalRef.current.querySelectorAll<HTMLElement>(
      'button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener("keydown", handleFocusTrap);
    return () => document.removeEventListener("keydown", handleFocusTrap);
  }, [isOpen, handleFocusTrap]);

  const handleSendMessage = async (message: string) => {
    if (!message.trim() || isLoading) return;

    setShowInitial(false);
    const userMessage: ChatMessage = { role: "user", content: message };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await sendMessageToGemini(
        messages,
        message,
        currentLang
      );
      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: response,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      const errorMessage: ChatMessage = {
        role: "assistant",
        content: t("chat.error"),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputValue);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  if (!isOpen) return null;

  const isConfigured = isGeminiConfigured();

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal - Centered with responsive widths */}
      <div
        className="fixed inset-0 z-[101] flex items-center justify-center p-4 pt-20 sm:pt-24 md:pt-28"
        onClick={onClose}
      >
        <div
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="ai-chat-title"
          className="flex flex-col w-[95%] sm:w-[80%] md:w-[70%] max-w-[800px] h-[80vh] max-h-[700px] rounded-[24px] overflow-hidden animate-fade-in-up"
          onClick={(e) => e.stopPropagation()}
          style={{
            background: "rgba(15, 15, 20, 0.95)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow:
              "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(59, 201, 255, 0.1)",
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center border border-cyan-500/30">
                <MessageCircle className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h3 id="ai-chat-title" className="text-white font-semibold text-sm">
                  {t("chat.title")}
                </h3>
                <p className="text-white/50 text-xs">
                  {t("chat.subtitle")}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {!isConfigured ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-white/50 text-center text-sm px-4">
                  {t("chat.notConfigured")}
                </p>
              </div>
            ) : showInitial ? (
              <div className="space-y-6">
                {/* Initial message */}
                <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                  <p className="text-white/80 text-sm leading-relaxed">
                    {CHAT_INITIAL_MESSAGE[currentLang]}
                  </p>
                </div>

                {/* Suggestion chips */}
                <div className="space-y-2">
                  <p className="text-white/60 text-xs uppercase tracking-wider">
                    {t("chat.suggested")}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {INITIAL_SUGGESTIONS[currentLang].map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="px-3 py-2 text-xs text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 hover:border-cyan-500/40 rounded-full transition-all duration-200"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div aria-live="polite" aria-relevant="additions">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                        message.role === "user"
                          ? "bg-cyan-500/20 text-white border border-cyan-500/30"
                          : "bg-white/5 text-white/90 border border-white/5"
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {message.content}
                      </p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white/5 rounded-2xl px-4 py-3 border border-white/5">
                      <Loader2 className="w-5 h-5 text-cyan-400 animate-spin" />
                    </div>
                  </div>
                )}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          {isConfigured && (
            <div className="p-4 border-t border-white/10">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    t("chat.placeholder")
                  }
                  disabled={isLoading}
                  className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-3 text-sm text-white placeholder-white/50 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all disabled:opacity-50"
                />
                <button
                  onClick={() => handleSendMessage(inputValue)}
                  disabled={!inputValue.trim() || isLoading}
                  className="w-11 h-11 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_20px_rgba(59,201,255,0.4)] transition-all duration-200"
                  aria-label="Send message"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <p className="text-white/70 text-[10px] text-center mt-2">
                {t("chat.disclaimer")}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AIChatModal;
