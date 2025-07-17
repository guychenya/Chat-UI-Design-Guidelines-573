import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { useSettings } from './SettingsContext';
import { sendMessage } from '../services/apiService';

const ChatContext = createContext();

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const { settings } = useSettings();
  
  const [conversations, setConversations] = useState(() => {
    try {
      const saved = localStorage.getItem('conversations');
      return saved ? JSON.parse(saved) : [
        {
          id: '1',
          title: 'Welcome Chat',
          messages: [
            {
              id: '1',
              type: 'ai',
              content: "# Welcome to AI Assistant\n\nI'm your AI assistant, designed to help you with a variety of tasks. Here are some things I can do for you:\n\n- Answer questions and provide information\n- Help with writing and creative tasks\n- Assist with code and programming\n- Analyze data and provide insights\n\nHow can I help you today?",
              timestamp: new Date().toISOString(),
            }
          ],
          model: 'gpt-4',
          createdAt: new Date().toISOString(),
        }
      ];
    } catch (err) {
      console.error('Error loading conversations:', err);
      return [
        {
          id: '1',
          title: 'Welcome Chat',
          messages: [
            {
              id: '1',
              type: 'ai',
              content: "# Welcome to AI Assistant\n\nI'm your AI assistant, designed to help you with a variety of tasks. How can I help you today?",
              timestamp: new Date().toISOString(),
            }
          ],
          model: 'gpt-4',
          createdAt: new Date().toISOString(),
        }
      ];
    }
  });
  
  const [activeConversationId, setActiveConversationId] = useState('1');
  const [selectedModel, setSelectedModel] = useState('gpt-4');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Save conversations to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('conversations', JSON.stringify(conversations));
    } catch (err) {
      console.error('Error saving conversations:', err);
    }
  }, [conversations]);

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

  const addMessage = async (message) => {
    setConversations(prev => prev.map(conv => 
      conv.id === activeConversationId ? {
        ...conv,
        messages: [...conv.messages, message],
        title: conv.title === 'New Chat' && message.type === 'user' 
          ? message.content.substring(0, 30) + (message.content.length > 30 ? '...' : '') 
          : conv.title
      } : conv
    ));

    // If it's a user message, generate AI response
    if (message.type === 'user') {
      setIsTyping(true);
      
      try {
        // Check if we have a default provider set and API keys available
        if (settings.defaultProviderId && settings.apiKeys && Object.keys(settings.apiKeys).length > 0) {
          // Use the API service to get a response from the selected provider
          const response = await sendMessage(
            message.content, 
            settings.defaultProviderId, 
            settings.apiKeys,
            selectedModel
          );
          
          const aiMessage = {
            id: (Date.now() + 1).toString(),
            type: 'ai',
            content: response.content,
            timestamp: new Date().toISOString(),
            provider: response.provider,
            error: response.error
          };
          
          setConversations(prev => prev.map(conv => 
            conv.id === activeConversationId ? {
              ...conv,
              messages: [...conv.messages, aiMessage]
            } : conv
          ));
        } else {
          // Fall back to simulated response if no API keys are set
          setTimeout(() => {
            const aiMessage = {
              id: (Date.now() + 1).toString(),
              type: 'ai',
              content: generateAIResponse(message.content, message.referencedMessageId),
              timestamp: new Date().toISOString(),
            };
            
            setConversations(prev => prev.map(conv => 
              conv.id === activeConversationId ? {
                ...conv,
                messages: [...conv.messages, aiMessage]
              } : conv
            ));
            
            setIsTyping(false);
          }, 1000 + Math.min(message.content.length * 10, 2000));
        }
      } catch (error) {
        // Handle errors
        const errorMessage = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: `Error: ${error.message || 'Failed to generate a response'}. Please check your API keys in settings.`,
          timestamp: new Date().toISOString(),
          error: true
        };
        
        setConversations(prev => prev.map(conv => 
          conv.id === activeConversationId ? {
            ...conv,
            messages: [...conv.messages, errorMessage]
          } : conv
        ));
      } finally {
        setIsTyping(false);
      }
    }
  };

  const updateConversationTitle = (id, title) => {
    setConversations(prev => prev.map(conv => 
      conv.id === id ? { ...conv, title } : conv
    ));
  };

  const deleteConversation = (id) => {
    setConversations(prev => prev.filter(conv => conv.id !== id));
    if (activeConversationId === id) {
      const remaining = conversations.filter(conv => conv.id !== id);
      setActiveConversationId(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  const regenerateResponse = async (messageId) => {
    // Find the last AI message
    const conversation = conversations.find(conv => conv.id === activeConversationId);
    if (!conversation) return;

    // Find the message to regenerate and its preceding user message
    const messageIndex = conversation.messages.findIndex(msg => msg.id === messageId);
    if (messageIndex < 0 || conversation.messages[messageIndex].type !== 'ai') return;

    // Get the preceding user message if available
    let userMessage = "Help me with something";
    for (let i = messageIndex - 1; i >= 0; i--) {
      if (conversation.messages[i].type === 'user') {
        userMessage = conversation.messages[i].content;
        break;
      }
    }

    // Remove the AI message and all messages after it
    const updatedMessages = conversation.messages.slice(0, messageIndex);

    // Update the conversation
    setConversations(prev => prev.map(conv => 
      conv.id === activeConversationId ? {
        ...conv,
        messages: updatedMessages
      } : conv
    ));

    // Show typing indicator
    setIsTyping(true);

    try {
      // Check if we have a default provider set and API keys available
      if (settings.defaultProviderId && settings.apiKeys && Object.keys(settings.apiKeys).length > 0) {
        // Use the API service to get a response
        const response = await sendMessage(
          userMessage, 
          settings.defaultProviderId, 
          settings.apiKeys,
          selectedModel
        );
        
        const newAiMessage = {
          id: Date.now().toString(),
          type: 'ai',
          content: response.content,
          timestamp: new Date().toISOString(),
          provider: response.provider,
          error: response.error
        };
        
        setConversations(prev => prev.map(conv => 
          conv.id === activeConversationId ? {
            ...conv,
            messages: [...conv.messages, newAiMessage]
          } : conv
        ));
      } else {
        // Fall back to simulated response
        setTimeout(() => {
          const newAiMessage = {
            id: Date.now().toString(),
            type: 'ai',
            content: generateAIResponse(userMessage),
            timestamp: new Date().toISOString(),
          };
          
          setConversations(prev => prev.map(conv => 
            conv.id === activeConversationId ? {
              ...conv,
              messages: [...conv.messages, newAiMessage]
            } : conv
          ));
        }, 2000);
      }
    } catch (error) {
      // Handle errors
      const errorMessage = {
        id: Date.now().toString(),
        type: 'ai',
        content: `Error: ${error.message || 'Failed to regenerate a response'}. Please check your API keys in settings.`,
        timestamp: new Date().toISOString(),
        error: true
      };
      
      setConversations(prev => prev.map(conv => 
        conv.id === activeConversationId ? {
          ...conv,
          messages: [...conv.messages, errorMessage]
        } : conv
      ));
    } finally {
      setIsTyping(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Helper function to generate AI responses
  const generateAIResponse = (userMessage, referencedMessageId) => {
    // Find referenced message if any
    let referencedContent = "";
    if (referencedMessageId && activeConversation) {
      const referencedMessage = activeConversation.messages.find(msg => msg.id === referencedMessageId);
      if (referencedMessage) {
        referencedContent = referencedMessage.content;
      }
    }

    // Simple response templates
    const responses = [
      `I understand you're asking about: "${userMessage.substring(0, 50)}${userMessage.length > 50 ? '...' : ''}"\n\nHere's my response:\n\nThis is a simulated AI response. In a real implementation, this would connect to an actual AI model API that would generate a thoughtful and helpful response based on your input.`,
      
      `# Regarding Your Question\n\nYou asked: "${userMessage.substring(0, 40)}${userMessage.length > 40 ? '...' : ''}"\n\n## Analysis\n\nThis is a simulated response that would normally be generated by an AI model. The actual implementation would provide a detailed answer based on your specific question.\n\n## Key Points\n\n- Point 1: Important information related to your query\n- Point 2: Additional context that might help\n- Point 3: Practical application or example`,
      
      `I've analyzed your question about "${userMessage.substring(0, 30)}${userMessage.length > 30 ? '...' : ''}"\n\nHere's what I found:\n\n\`\`\`\nThis is where a code example or formatted data would appear in a real AI response\n\`\`\`\n\nDoes this help with what you were looking for?`
    ];

    // If there's a referenced message, create a more specific response
    if (referencedContent) {
      return `Regarding your reference to: "${referencedContent.substring(0, 40)}${referencedContent.length > 40 ? '...' : ''}"\n\nYou asked: "${userMessage}"\n\n## Additional Details\n\nThis is a simulated response that would elaborate on the referenced content. In a real implementation, the AI would analyze the context from both messages to provide a cohesive and relevant response.`;
    }

    // Return a random response
    return responses[Math.floor(Math.random() * responses.length)];
  };

  return (
    <ChatContext.Provider
      value={{
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
        regenerateResponse,
        scrollToBottom,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};