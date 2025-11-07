import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";
import { MessageCircle, Send, Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

export default function Messages() {
  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);
  const [messageContent, setMessageContent] = useState("");
  const [newConversationDialogOpen, setNewConversationDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const utils = trpc.useUtils();

  // Récupérer les conversations
  const { data: conversations } = trpc.messaging.conversations.useQuery(undefined, {
    refetchInterval: 5000, // Rafraîchir toutes les 5 secondes
  });

  // Récupérer les messages de la conversation sélectionnée
  const { data: messagesData } = trpc.messaging.messages.useQuery(
    { conversationId: selectedConversationId! },
    { 
      enabled: selectedConversationId !== null,
      refetchInterval: 2000, // Rafraîchir toutes les 2 secondes
    }
  );

  // Récupérer tous les utilisateurs pour démarrer une conversation
  const { data: users } = trpc.users.list.useQuery();

  // Mutation pour créer ou récupérer une conversation
  const createConversation = trpc.messaging.createOrGetDirectConversation.useMutation({
    onSuccess: (conversationId) => {
      if (conversationId) setSelectedConversationId(conversationId);
      setNewConversationDialogOpen(false);
      utils.messaging.conversations.invalidate();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // Mutation pour envoyer un message
  const sendMessage = trpc.messaging.sendMessage.useMutation({
    onSuccess: () => {
      setMessageContent("");
      utils.messaging.messages.invalidate();
      utils.messaging.conversations.invalidate();
      scrollToBottom();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // Mutation pour marquer comme lu
  const markAsRead = trpc.messaging.markAsRead.useMutation();

  // Scroll automatique vers le bas
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messagesData]);

  // Marquer la conversation comme lue quand elle est sélectionnée
  useEffect(() => {
    if (selectedConversationId) {
      markAsRead.mutate({ conversationId: selectedConversationId });
    }
  }, [selectedConversationId]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageContent.trim() || !selectedConversationId) return;

    sendMessage.mutate({
      conversationId: selectedConversationId,
      content: messageContent.trim(),
    });
  };

  const handleStartConversation = (userId: number) => {
    createConversation.mutate({ otherUserId: userId });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const filteredUsers = users?.filter((user) =>
    user.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-4rem)] flex gap-4">
      {/* Sidebar - Liste des conversations */}
      <Card className="w-80 flex flex-col border-0 shadow-lg">
        <div className="p-4 border-b bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              <h2 className="text-lg font-semibold">Messages</h2>
            </div>
            <Dialog open={newConversationDialogOpen} onOpenChange={setNewConversationDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="secondary">
                  <Plus className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Nouvelle conversation</DialogTitle>
                  <DialogDescription>
                    Sélectionnez un utilisateur pour démarrer une conversation
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher un utilisateur..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <div className="max-h-[400px] overflow-y-auto space-y-2">
                    {filteredUsers?.map((user) => (
                      <button
                        key={user.id}
                        onClick={() => handleStartConversation(user.id)}
                        className="w-full flex items-center gap-3 p-3 hover:bg-accent rounded-lg transition-colors"
                      >
                        <Avatar>
                          <AvatarFallback className="bg-purple-100 text-purple-600">
                            {getInitials(user.name || "U")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 text-left">
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {conversations && conversations.length > 0 ? (
            conversations.map((conv: any) => {
              const otherUser = conv.otherParticipant;
              const lastMessage = conv.lastMessage;
              
              return (
                <button
                  key={conv.conversation.id}
                  onClick={() => setSelectedConversationId(conv.conversation.id)}
                  className={`w-full p-4 border-b hover:bg-accent transition-colors text-left ${
                    selectedConversationId === conv.conversation.id ? "bg-accent" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-purple-100 text-purple-600">
                        {getInitials(otherUser?.name || "U")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium truncate">{otherUser?.name || "Utilisateur"}</p>
                        {lastMessage && (
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(lastMessage.createdAt), {
                              addSuffix: true,
                              locale: fr,
                            })}
                          </span>
                        )}
                      </div>
                      {lastMessage && (
                        <p className="text-sm text-muted-foreground truncate">
                          {lastMessage.content}
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              );
            })
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Aucune conversation</p>
              <p className="text-sm mt-2">Cliquez sur + pour démarrer une conversation</p>
            </div>
          )}
        </div>
      </Card>

      {/* Zone de chat */}
      <Card className="flex-1 flex flex-col border-0 shadow-lg">
        {selectedConversationId ? (
          <>
            {/* Header du chat */}
            <div className="p-4 border-b bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-t-lg">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback className="bg-white text-blue-600">
                    {conversations
                      ?.find((c: any) => c.conversation.id === selectedConversationId)
                      ?.otherParticipant?.name?.slice(0, 2)
                      .toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">
                    {conversations?.find((c: any) => c.conversation.id === selectedConversationId)
                      ?.otherParticipant?.name || "Utilisateur"}
                  </p>
                  <p className="text-sm opacity-90">En ligne</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messagesData?.map((msg: any) => {
                const isCurrentUser = msg.message.senderId === msg.sender.id;
                
                return (
                  <div
                    key={msg.message.id}
                    className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`flex items-end gap-2 max-w-[70%] ${isCurrentUser ? "flex-row-reverse" : ""}`}>
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className={isCurrentUser ? "bg-blue-100 text-blue-600" : "bg-purple-100 text-purple-600"}>
                          {getInitials(msg.sender.name || "U")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div
                          className={`rounded-2xl px-4 py-2 ${
                            isCurrentUser
                              ? "bg-blue-500 text-white"
                              : "bg-white border shadow-sm"
                          }`}
                        >
                          <p className="text-sm">{msg.message.content}</p>
                        </div>
                        <p className={`text-xs text-muted-foreground mt-1 ${isCurrentUser ? "text-right" : ""}`}>
                          {formatDistanceToNow(new Date(msg.message.createdAt), {
                            addSuffix: true,
                            locale: fr,
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input de message */}
            <form onSubmit={handleSendMessage} className="p-4 border-t bg-white">
              <div className="flex gap-2">
                <Input
                  placeholder="Écrivez votre message..."
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" disabled={!messageContent.trim() || sendMessage.isPending}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <MessageCircle className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">Sélectionnez une conversation</p>
              <p className="text-sm mt-2">Choisissez une conversation dans la liste ou démarrez-en une nouvelle</p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
