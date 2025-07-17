// Storage Service for handling local storage operations
const STORAGE_KEYS = {
  CONVERSATIONS: 'conversations',
  SETTINGS: 'appSettings',
  THEME: 'theme'
};

// Ensure conversation data is properly structured
const validateConversation = (conversation) => {
  const required = ['id', 'title', 'messages', 'createdAt'];
  return required.every(key => Object.prototype.hasOwnProperty.call(conversation, key));
};

// Save conversations to local storage
export const saveConversations = (conversations) => {
  try {
    // Validate conversations before saving
    const validConversations = conversations.filter(validateConversation);
    localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(validConversations));
    return true;
  } catch (error) {
    console.error('Error saving conversations:', error);
    return false;
  }
};

// Load conversations from local storage
export const loadConversations = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.CONVERSATIONS);
    if (!saved) return [];

    const conversations = JSON.parse(saved);
    // Validate and filter out invalid conversations
    return conversations.filter(validateConversation);
  } catch (error) {
    console.error('Error loading conversations:', error);
    return [];
  }
};

// Import conversations from a file
export const importConversations = (importedData) => {
  try {
    // Validate imported data structure
    if (!importedData?.conversations || !Array.isArray(importedData.conversations)) {
      throw new Error('Invalid import data structure');
    }

    // Filter and validate imported conversations
    const validConversations = importedData.conversations.filter(validateConversation);

    // Load existing conversations
    const existingConversations = loadConversations() || [];

    // Merge conversations, avoiding duplicates
    const mergedConversations = [
      ...existingConversations,
      ...validConversations.filter(imported => 
        !existingConversations.some(existing => existing.id === imported.id)
      )
    ];

    // Save merged conversations
    return saveConversations(mergedConversations);
  } catch (error) {
    console.error('Error importing conversations:', error);
    return false;
  }
};

// Export conversations to a file
export const exportConversations = (conversations) => {
  try {
    const exportData = {
      conversations: conversations.filter(validateConversation),
      exportDate: new Date().toISOString(),
      version: '1.0'
    };

    return new Blob([JSON.stringify(exportData, null, 2)], { 
      type: 'application/json' 
    });
  } catch (error) {
    console.error('Error exporting conversations:', error);
    return null;
  }
};

// Clear all conversations from storage
export const clearConversations = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.CONVERSATIONS);
    return true;
  } catch (error) {
    console.error('Error clearing conversations:', error);
    return false;
  }
};

// Save a single conversation
export const saveConversation = (conversation) => {
  try {
    if (!validateConversation(conversation)) {
      throw new Error('Invalid conversation structure');
    }

    const conversations = loadConversations() || [];
    const index = conversations.findIndex(c => c.id === conversation.id);

    if (index >= 0) {
      conversations[index] = conversation;
    } else {
      conversations.push(conversation);
    }

    return saveConversations(conversations);
  } catch (error) {
    console.error('Error saving conversation:', error);
    return false;
  }
};

// Delete a conversation
export const deleteConversation = (conversationId) => {
  try {
    const conversations = loadConversations();
    if (!conversations) return false;

    const filtered = conversations.filter(c => c.id !== conversationId);
    return saveConversations(filtered);
  } catch (error) {
    console.error('Error deleting conversation:', error);
    return false;
  }
};

// Archive/Unarchive a conversation
export const toggleConversationArchive = (conversationId) => {
  try {
    const conversations = loadConversations();
    if (!conversations) return false;

    const updated = conversations.map(c => 
      c.id === conversationId 
        ? { ...c, archived: !c.archived }
        : c
    );

    return saveConversations(updated);
  } catch (error) {
    console.error('Error toggling conversation archive:', error);
    return false;
  }
};