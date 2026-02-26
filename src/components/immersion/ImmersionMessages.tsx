import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Paperclip, Check, CheckCheck, Loader2 } from "lucide-react";
import { useMessages, useSendMessage } from "@/hooks/useImmersion";
import { getRelativeTime } from "@/lib/walletService";
import type { PortalRole, MessageRole } from "@/lib/immersionTypes";

interface ImmersionMessagesProps {
  engagementId: string;
  userRole: PortalRole;
}

const ROLE_COLORS: Record<MessageRole, string> = {
  client: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  advisor: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  admin: "bg-amber-500/10 text-amber-600 border-amber-500/20",
};

const ROLE_LABELS: Record<MessageRole, string> = {
  client: "Client",
  advisor: "Advisor",
  admin: "Admin",
};

export function ImmersionMessages({ engagementId, userRole }: ImmersionMessagesProps) {
  const { data: messages, isLoading } = useMessages(engagementId);
  const sendMutation = useSendMessage(engagementId);
  const [messageBody, setMessageBody] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!messageBody.trim()) return;
    sendMutation.mutate(
      { body: messageBody },
      {
        onSuccess: () => setMessageBody(""),
      }
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[600px]">
      {/* Messages Area */}
      <Card className="flex-1 overflow-hidden">
        <ScrollArea className="h-full p-4" ref={scrollRef}>
          {!messages || messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg) => {
                const isReply = !!msg.reply_to_id;
                const roleColor = ROLE_COLORS[msg.sender_role as MessageRole] || ROLE_COLORS.client;
                const roleLabel = ROLE_LABELS[msg.sender_role as MessageRole] || msg.sender_role;

                return (
                  <div key={msg.id} className={`${isReply ? "ml-8" : ""}`}>
                    <div className="flex items-start gap-3">
                      {/* Avatar */}
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0 text-xs font-bold">
                        {msg.sender_name?.charAt(0).toUpperCase() || "?"}
                      </div>

                      <div className="flex-1 min-w-0">
                        {/* Sender Info */}
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-semibold">{msg.sender_name}</span>
                          <Badge variant="outline" className={`text-xs ${roleColor}`}>
                            {roleLabel}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {getRelativeTime(msg.created_at)}
                          </span>
                        </div>

                        {/* Body */}
                        <p className="text-sm whitespace-pre-wrap">{msg.body}</p>

                        {/* Attachments */}
                        {msg.attachments && (msg.attachments as Array<{name: string; url: string; type: string}>).length > 0 && (
                          <div className="flex gap-2 mt-2 flex-wrap">
                            {(msg.attachments as Array<{name: string; url: string; type: string}>).map((att, idx) => (
                              <a
                                key={idx}
                                href={att.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-2 py-1 bg-muted rounded text-xs hover:bg-muted/80 transition-colors"
                              >
                                <Paperclip className="w-3 h-3" />
                                {att.name}
                              </a>
                            ))}
                          </div>
                        )}

                        {/* Read Receipt */}
                        <div className="flex items-center gap-1 mt-1">
                          {msg.is_read ? (
                            <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
                          ) : (
                            <Check className="w-3.5 h-3.5 text-muted-foreground" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </Card>

      {/* Message Input */}
      <div className="mt-4 flex gap-2">
        <Textarea
          value={messageBody}
          onChange={(e) => setMessageBody(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="min-h-[44px] max-h-32 resize-none"
          rows={1}
        />
        <Button
          onClick={handleSend}
          disabled={!messageBody.trim() || sendMutation.isPending}
          size="icon"
          className="flex-shrink-0 h-[44px] w-[44px]"
        >
          {sendMutation.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
