/**
 * ChatModeContext - Manages chat interface toggle between CopilotKit and FinancialChatPanel
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type ChatMode = 'copilot' | 'financial';

interface ChatModeContextType {
  chatMode: ChatMode;
  setChatMode: (mode: ChatMode) => void;
  toggleChatMode: () => void;
}

const ChatModeContext = createContext<ChatModeContextType | undefined>(undefined);

interface ChatModeProviderProps {
  children: ReactNode;
}

export const ChatModeProvider: React.FC<ChatModeProviderProps> = ({ children }) => {
  const [chatMode, setChatModeState] = useState<ChatMode>(() => {
    // Initialize from localStorage or default to 'financial'
    const stored = localStorage.getItem('previa_chat_mode');
    return (stored === 'copilot' || stored === 'financial') ? stored : 'financial';
  });

  const setChatMode = (mode: ChatMode) => {
    setChatModeState(mode);
    localStorage.setItem('previa_chat_mode', mode);
  };

  const toggleChatMode = () => {
    const newMode: ChatMode = chatMode === 'copilot' ? 'financial' : 'copilot';
    setChatMode(newMode);
  };

  useEffect(() => {
    // Sync with localStorage on mount
    localStorage.setItem('previa_chat_mode', chatMode);
  }, [chatMode]);

  return (
    <ChatModeContext.Provider value={{ chatMode, setChatMode, toggleChatMode }}>
      {children}
    </ChatModeContext.Provider>
  );
};

export const useChatMode = (): ChatModeContextType => {
  const context = useContext(ChatModeContext);
  if (!context) {
    throw new Error('useChatMode must be used within a ChatModeProvider');
  }
  return context;
};
