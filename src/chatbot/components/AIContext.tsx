import { createContext, useContext, useState } from "react";

interface AIContextType {
  isChatOpen: boolean;
  toggleChat: () => void;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

import type { PropsWithChildren } from "react";

export const AIProvider = ({ children }: PropsWithChildren<{}>) => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    setIsChatOpen((prev) => !prev);
  };

  return (
    <AIContext.Provider value={{ isChatOpen, toggleChat }}>
      {children}
    </AIContext.Provider>
  );
};

export const useAI = () => {
  const context = useContext(AIContext);
  if (!context) {
    throw new Error("useAI must be used within an AIProvider");
  }
  return context;
};