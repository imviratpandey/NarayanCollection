import { MessageCircle, Send, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";

type Message = {
  id: string;
  sender: "bot" | "user";
  text: string;
};

const PHONE_NUMBER = "918112980211";

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "bot",
      text: "Hi there! 👋 Welcome to Narayan Collection. How can we help you today?",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const addMessage = (sender: "bot" | "user", text: string) => {
    setMessages((prev) => [...prev, { id: Math.random().toString(), sender, text }]);
  };

  const handleQuickReply = async (question: string) => {
    addMessage("user", question);
    
    setTimeout(async () => {
      if (question === "Do you offer COD?") {
        addMessage("bot", "Yes! We offer Cash on Delivery (COD) across India.");
      } else if (question === "How long does shipping take?") {
        addMessage("bot", "Orders are usually delivered within 3-5 business days.");
      } else if (question === "Talk to a human") {
        addMessage("bot", "Sure! I'm redirecting you to our team on WhatsApp...");
        setTimeout(() => {
          window.open(`https://wa.me/${PHONE_NUMBER}?text=Hi Narayan Collection, I need some help!`, "_blank");
        }, 1500);
      } else {
        await fetchAiResponse(question);
      }
    }, 600);
  };

  const [isLoading, setIsLoading] = useState(false);

  const fetchAiResponse = async (userText: string) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/public/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Send previous messages (excluding the one we just added)
        body: JSON.stringify({ message: userText, history: messages.slice(1) }),
      });
      const data = await res.json();
      addMessage("bot", data.reply || "I'm having trouble connecting right now.");
    } catch (e) {
      addMessage("bot", "Error connecting to AI. Please try 'Talk to a human' below.");
    }
    setIsLoading(false);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userText = inputValue;
    addMessage("user", userText);
    setInputValue("");

    await fetchAiResponse(userText);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="flex h-[450px] w-[320px] flex-col overflow-hidden rounded-2xl border border-border/60 bg-background shadow-2xl transition-all sm:w-[350px]">
          {/* Header */}
          <div className="flex items-center justify-between bg-primary p-4 text-primary-foreground">
            <div>
              <h3 className="font-semibold tracking-wide">Narayan Support</h3>
              <p className="text-xs text-primary-foreground/80">Typically replies instantly</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20 hover:text-primary-foreground"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Chat Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/30">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${
                    msg.sender === "user"
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-card border border-border/50 text-foreground rounded-bl-sm"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          {messages.length === 1 && (
            <div className="p-3 bg-background flex flex-wrap gap-2 border-t border-border/40">
              <button
                onClick={() => handleQuickReply("Do you offer COD?")}
                className="rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/10"
              >
                Do you offer COD?
              </button>
              <button
                onClick={() => handleQuickReply("How long does shipping take?")}
                className="rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/10"
              >
                Shipping time?
              </button>
              <button
                onClick={() => handleQuickReply("Talk to a human")}
                className="rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/10"
              >
                Talk to a human
              </button>
            </div>
          )}

          {/* Input Area */}
          <div className="border-t border-border/60 bg-background p-3">
            <form onSubmit={handleSend} className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Type a message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1 rounded-full border border-input bg-transparent px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <Button type="submit" size="icon" className="h-9 w-9 rounded-full shrink-0">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl transition-transform hover:scale-110 active:scale-95"
          aria-label="Open chat"
        >
          <MessageCircle className="h-6 w-6 transition-transform group-hover:scale-110" />
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-background">
            1
          </span>
        </button>
      )}
    </div>
  );
}
