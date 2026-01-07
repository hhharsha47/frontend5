"use client";

import { useState, useEffect, useCallback } from "react";

export type Message = {
  id: string;
  role: "bot" | "user";
  content: string;
  type?: "text" | "options" | "image";
  options?: { label: string; value: string }[];
};

export type OrderState = {
  type?: string;
  scale?: string;
  description?: string;
  email?: string;
};

export type Conversation = {
  id: string;
  title: string;
  updatedAt: number;
  messages: Message[];
  mode: "init" | "order" | "chat";
  orderStep: number;
  orderData: OrderState;
};

const STORAGE_KEY = "skyscale_chat_history_v1";

const createDefaultMessage = (): Message => ({
  id: "1",
  role: "bot",
  content: "Hello! Welcome to SkyScale. How can I assist you today?",
  type: "options",
  options: [
    { label: "Start Custom Order", value: "start_order" },
    { label: "Ask a Question", value: "ask_question" },
  ],
});

const createNewConversationFn = (): Conversation => ({
  id: crypto.randomUUID(),
  title: "New Conversation",
  updatedAt: Date.now(),
  messages: [createDefaultMessage()],
  mode: "init",
  orderStep: 0,
  orderData: {},
});

export function useChatHistory() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: Conversation[] = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Sort by updatedAt desc
          parsed.sort((a, b) => b.updatedAt - a.updatedAt);
          setConversations(parsed);
          setActiveId(parsed[0].id);
        } else {
          // Initialize with one empty chat if array is empty
          const newChat = createNewConversationFn();
          setConversations([newChat]);
          setActiveId(newChat.id);
        }
      } else {
        // First time user
        const newChat = createNewConversationFn();
        setConversations([newChat]);
        setActiveId(newChat.id);
      }
    } catch (error) {
      console.error("Failed to load chat history", error);
      // Fallback
      const newChat = createNewConversationFn();
      setConversations([newChat]);
      setActiveId(newChat.id);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage whenever conversations change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
    }
  }, [conversations, isLoaded]);

  const createNewChat = useCallback(() => {
    const newChat = createNewConversationFn();
    setConversations((prev) => [newChat, ...prev]);
    setActiveId(newChat.id);
  }, []);

  const selectChat = useCallback((id: string) => {
    setActiveId(id);
  }, []);

  const deleteChat = useCallback(
    (id: string, e?: React.MouseEvent) => {
      e?.stopPropagation(); // Prevent triggering selection
      setConversations((prev) => {
        const filtered = prev.filter((c) => c.id !== id);
        // If we deleted the active one, switch to the first available or create new
        if (id === activeId) {
          if (filtered.length > 0) {
            setActiveId(filtered[0].id);
          } else {
            const newChat = createNewConversationFn();
            return [newChat];
          }
        } else if (filtered.length === 0) {
             // Should theoretically not happen if logic above is correct for activeId, 
             // but good for safety if we delete a non-active last item? 
             // Logic above covers activeId deletion. 
             // If we delete a non-active item and it was the last one (impossible if activeId exists and differs), 
             // but let's be safe.
             const newChat = createNewConversationFn();
             return [newChat];
        } else {
            // we deleted a non-active chat and others remain
             if (filtered.length === 0) {
                 // Double check specific edge case where activeId might have been null?
                 const newChat = createNewConversationFn();
                 setActiveId(newChat.id);
                 return [newChat];
             }
        }
        
        // If we deleted the active chat, we need to update activeId in the state update immediately? 
        // We can't do it inside the setState callback easily for the *other* state hook (activeId).
        // So we might need a separate effect or better logic structure. 
        // Actually, let's refine this.
        return filtered;
      });

      // We need to handle activeId update separately if we deleted the active one.
      // Since we can't synchronously access the *new* state of conversations here easily without prop drilling logic inside setState,
      // let's just do it based on `prev` logic approximation or use a separate effect. 
      // BETTER APPROACH: Calculate new list first.
    },
    [activeId]
  );
  
  // Refined deleteChat to handle activeId correctly
  const deleteChatSafe = useCallback((id: string, e?: React.MouseEvent) => {
      e?.stopPropagation();
      setConversations(prev => {
          const newList = prev.filter(c => c.id !== id);
          if (newList.length === 0) {
              const newChat = createNewConversationFn();
              setActiveId(newChat.id);
              return [newChat];
          }
          // If deleted active chat, switch to first
          setActiveId(currentId => {
              if (currentId === id) {
                  return newList[0].id;
              }
              return currentId;
          });
          return newList;
      });
  }, []);


  const updateChat = useCallback(
    (
      id: string,
      updates: Partial<Pick<Conversation, "messages" | "mode" | "orderStep" | "orderData">>
    ) => {
      setConversations((prev) => {
        const updated = prev.map((c) => {
          if (c.id === id) {
            // Auto-generate title from first user message if title is still default
            let newTitle = c.title;
            if (updates.messages && c.title === "New Conversation") {
                const firstUserMsg = updates.messages.find(m => m.role === "user");
                if (firstUserMsg) {
                    newTitle = firstUserMsg.content.slice(0, 30) + (firstUserMsg.content.length > 30 ? "..." : "");
                }
            }
            
            // Only update timestamp if messages changed length or content, or if order step changed
            // This prevents "jumping" when just selecting a chat (which triggers an initial sync)
            const hasChanges = 
                (updates.messages && updates.messages.length !== c.messages.length) ||
                (updates.orderStep !== undefined && updates.orderStep !== c.orderStep) ||
                (updates.mode !== undefined && updates.mode !== c.mode);

            return {
              ...c,
              ...updates,
              title: newTitle,
              updatedAt: hasChanges ? Date.now() : c.updatedAt,
            };
          }
          return c;
        });
        
        // Always keep sorted by newest
        return updated.sort((a, b) => b.updatedAt - a.updatedAt);
      });
    },
    []
  );
  
  const getActiveConversation = useCallback(() => {
      return conversations.find(c => c.id === activeId) || null;
  }, [conversations, activeId]);

  return {
    conversations,
    activeId,
    isLoaded,
    createNewChat,
    selectChat,
    deleteChat: deleteChatSafe,
    updateChat,
    getActiveConversation
  };
}
