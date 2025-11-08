import { Sparkles, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useRef } from "react";

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  changes?: Array<{
    courseCode: string;
    oldSection: string;
    newSection: string;
    reason: string;
  }>;
}

interface AiOptimizerPanelProps {
  messages: ChatMessage[];
  currentInput: string;
  onInputChange: (input: string) => void;
  onSendMessage: () => void;
  isProcessing: boolean;
  disabled: boolean;
}

export const AiOptimizerPanel = ({ 
  messages,
  currentInput,
  onInputChange,
  onSendMessage,
  isProcessing,
  disabled
}: AiOptimizerPanelProps) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (currentInput.trim() && !isProcessing && !disabled) {
        onSendMessage();
      }
    }
  };

  return (
    <aside className="w-80 bg-card border-l border-border flex flex-col h-full">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-lg">AI Schedule Assistant</h3>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Ask questions or request schedule optimizations
        </p>
      </div>
      
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-8 space-y-3">
              <div className="text-sm text-muted-foreground">
                Try asking:
              </div>
              <div className="space-y-2 text-xs text-muted-foreground">
                <div className="bg-muted/50 rounded-lg p-2">
                  "What CPSC courses are available on Tuesdays?"
                </div>
                <div className="bg-muted/50 rounded-lg p-2">
                  "Could you make my schedule more clustered?"
                </div>
                <div className="bg-muted/50 rounded-lg p-2">
                  "Show me afternoon sections for MATH 100"
                </div>
              </div>
            </div>
          )}
          
          {messages.map((message, index) => (
            <div 
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] rounded-lg px-3 py-2 ${
                message.role === 'user' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-foreground'
              }`}>
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                {message.changes && message.changes.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-border/40 space-y-1">
                    <p className="text-xs font-medium opacity-80">Schedule Changes:</p>
                    {message.changes.map((change, i) => (
                      <div key={i} className="text-xs opacity-90">
                        • {change.courseCode}: {change.oldSection} → {change.newSection}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {isProcessing && (
            <div className="flex justify-start">
              <div className="bg-muted text-foreground rounded-lg px-3 py-2">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  <span className="text-sm">Thinking...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <Input
            placeholder="Ask a question or request changes..."
            value={currentInput}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isProcessing || disabled}
            className="flex-1"
          />
          <Button 
            size="icon"
            disabled={disabled || !currentInput.trim() || isProcessing}
            onClick={onSendMessage}
          >
            {isProcessing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </aside>
  );
};
