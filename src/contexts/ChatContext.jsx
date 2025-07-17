import React, { createContext, useContext, useState, useRef } from 'react';

const ChatContext = createContext();

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const [conversations, setConversations] = useState([
    {
      id: '1',
      title: 'Welcome Chat',
      messages: [
        {
          id: '1',
          type: 'ai',
          content: 'Hello! I\'m your AI assistant. How can I help you today?',
          timestamp: new Date().toISOString(),
        }
      ],
      model: 'gpt-4',
      createdAt: new Date().toISOString(),
    }
  ]);

  const [activeConversationId, setActiveConversationId] = useState('1');
  const [selectedModel, setSelectedModel] = useState('gpt-4');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const activeConversation = conversations.find(conv => conv.id === activeConversationId);

  const createNewConversation = () => {
    const newConv = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [],
      model: selectedModel,
      createdAt: new Date().toISOString(),
    };
    setConversations(prev => [newConv, ...prev]);
    setActiveConversationId(newConv.id);
  };

  const addMessage = (message) => {
    setConversations(prev => 
      prev.map(conv => 
        conv.id === activeConversationId 
          ? { ...conv, messages: [...conv.messages, message] }
          : conv
      )
    );
  };

  const updateConversationTitle = (id, title) => {
    setConversations(prev => 
      prev.map(conv => 
        conv.id === id ? { ...conv, title } : conv
      )
    );
  };

  const deleteConversation = (id) => {
    setConversations(prev => prev.filter(conv => conv.id !== id));
    if (activeConversationId === id) {
      const remaining = conversations.filter(conv => conv.id !== id);
      setActiveConversationId(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <ChatContext.Provider value={{
      conversations,
      activeConversation,
      activeConversationId,
      setActiveConversationId,
      selectedModel,
      setSelectedModel,
      isTyping,
      setIsTyping,
      messagesEndRef,
      createNewConversation,
      addMessage,
      updateConversationTitle,
      deleteConversation,
      scrollToBottom,
    }}>
      {children}
    </ChatContext.Provider>
  );
};