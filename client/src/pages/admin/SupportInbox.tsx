import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Send, Loader2, MessageCircle, ArrowLeft } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { SupportMessage } from "@shared/schema";
import { format } from "date-fns";
import { Link } from "wouter";

interface Conversation {
  ambassadorUserId: string;
  ambassadorName: string;
  lastMessage: SupportMessage;
  unreadCount: number;
}

export default function SupportInbox() {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [message, setMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: conversations = [], isLoading: conversationsLoading } = useQuery<Conversation[]>({
    queryKey: ["/api/admin/support/conversations"],
    refetchInterval: 10000,
  });

  const { data: messages = [], isLoading: messagesLoading } = useQuery<SupportMessage[]>({
    queryKey: ["/api/admin/support/messages", selectedConversation?.ambassadorUserId],
    enabled: !!selectedConversation,
    refetchInterval: selectedConversation ? 5000 : false,
  });

  const sendMutation = useMutation({
    mutationFn: async ({ ambassadorUserId, content, ambassadorName }: { ambassadorUserId: string; content: string; ambassadorName: string }) => {
      return apiRequest("POST", `/api/admin/support/messages/${ambassadorUserId}`, { content, ambassadorName });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/support/messages", selectedConversation?.ambassadorUserId] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/support/conversations"] });
      setMessage("");
    },
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (message.trim() && selectedConversation) {
      sendMutation.mutate({
        ambassadorUserId: selectedConversation.ambassadorUserId,
        content: message.trim(),
        ambassadorName: selectedConversation.ambassadorName,
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const totalUnread = conversations.reduce((sum, c) => sum + c.unreadCount, 0);

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/portal">
          <Button variant="ghost" size="icon" data-testid="button-back-portal">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold" data-testid="text-page-title">Support Inbox</h1>
          <p className="text-muted-foreground">
            Manage ambassador support requests
            {totalUnread > 0 && (
              <Badge variant="destructive" className="ml-2">{totalUnread} unread</Badge>
            )}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
        <Card className="md:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Conversations
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[calc(100vh-320px)]">
              {conversationsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              ) : conversations.length === 0 ? (
                <div className="text-center py-8 px-4 text-muted-foreground text-sm">
                  No support conversations yet
                </div>
              ) : (
                <div className="divide-y">
                  {conversations.map((conv) => (
                    <button
                      key={conv.ambassadorUserId}
                      data-testid={`conversation-${conv.ambassadorUserId}`}
                      className={`w-full text-left p-4 hover-elevate transition-colors ${
                        selectedConversation?.ambassadorUserId === conv.ambassadorUserId
                          ? "bg-muted"
                          : ""
                      }`}
                      onClick={() => setSelectedConversation(conv)}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="font-medium truncate">{conv.ambassadorName}</span>
                        {conv.unreadCount > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            {conv.unreadCount}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {conv.lastMessage.content}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {format(new Date(conv.lastMessage.createdAt!), "MMM d, h:mm a")}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 flex flex-col">
          {selectedConversation ? (
            <>
              <CardHeader className="pb-3 border-b">
                <CardTitle className="text-lg">{selectedConversation.ambassadorName}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col p-0">
                <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                  {messagesLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {messages.map((msg) => (
                        <div
                          key={msg.id}
                          data-testid={`admin-message-${msg.id}`}
                          className={`flex flex-col ${
                            msg.sender === "support" ? "items-end" : "items-start"
                          }`}
                        >
                          <div
                            className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                              msg.sender === "support"
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                            }`}
                          >
                            {msg.content}
                          </div>
                          <span className="text-xs text-muted-foreground mt-1">
                            {msg.sender === "ambassador" ? "Ambassador" : "You"} - {format(new Date(msg.createdAt!), "MMM d, h:mm a")}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>

                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <Input
                      data-testid="input-admin-reply"
                      placeholder="Type a reply..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={handleKeyDown}
                      disabled={sendMutation.isPending}
                    />
                    <Button
                      data-testid="button-send-admin-reply"
                      size="icon"
                      onClick={handleSend}
                      disabled={!message.trim() || sendMutation.isPending}
                    >
                      {sendMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Select a conversation to view messages</p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
