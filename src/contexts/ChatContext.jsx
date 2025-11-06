import React, { createContext, useContext, useState, useEffect } from 'react';
import { saveConversations, loadConversations } from '../services/storageService';

const ChatContext = createContext();

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedModel, setSelectedModel] = useState('gpt-4');

  // Load conversations from storage on mount
  useEffect(() => {
    const loadedConversations = loadConversations();
    if (loadedConversations) {
      setConversations(loadedConversations);
    }
  }, []);

  // Save conversations whenever they change
  useEffect(() => {
    saveConversations(conversations);
  }, [conversations]);

  const createNewConversation = () => {
    const newConversation = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [],
      createdAt: new Date().toISOString(),
      archived: false
    };
    setConversations(prev => [...prev, newConversation]);
    setActiveConversationId(newConversation.id);
  };

  const deleteConversation = (id) => {
    setConversations(prev => prev.filter(conv => conv.id !== id));
    if (activeConversationId === id) {
      setActiveConversationId(null);
    }
  };

  const updateConversationTitle = (id, newTitle) => {
    setConversations(prev => 
      prev.map(conv => 
        conv.id === id ? { ...conv, title: newTitle } : conv
      )
    );
  };

  const addMessage = (message) => {
    if (!activeConversationId) return;
    setConversations(prev => 
      prev.map(conv => {
        if (conv.id === activeConversationId) {
          return {
            ...conv,
            messages: [...conv.messages, message]
          };
        }
        return conv;
      })
    );
  };

  const regenerateResponse = (messageId) => {
    // Implementation for regenerating response
    console.log('Regenerate response for message:', messageId);
  };

  const activeConversation = conversations.find(conv => conv.id === activeConversationId);

  return (
    <ChatContext.Provider value={{
      conversations,
      activeConversation,
      activeConversationId,
      isTyping,
      selectedModel,
      setActiveConversationId,
      createNewConversation,
      deleteConversation,
      updateConversationTitle,
      addMessage,
      setIsTyping,
      setSelectedModel,
      regenerateResponse
    }}>
      {children}
    </ChatContext.Provider>
  );
};