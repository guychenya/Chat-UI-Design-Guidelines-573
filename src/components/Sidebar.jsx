import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useChat } from '../contexts/ChatContext';
import { useTheme } from '../contexts/ThemeContext';
import ModelSelector from './ModelSelector';
import './Sidebar.css';

const { FiPlus, FiSearch, FiMoreVertical, FiEdit2, FiTrash2, FiMessageSquare } = FiIcons;

const Sidebar = ({ onClose }) => {
  const { theme } = useTheme();
  const {
    conversations,
    activeConversationId,
    setActiveConversationId,
    createNewConversation,
    updateConversationTitle,
    deleteConversation,
  } = useChat();

  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  const filteredConversations = conversations.filter(conv =>
    conv.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.messages.some(msg => msg.content.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleEditStart = (conv) => {
    setEditingId(conv.id);
    setEditTitle(conv.title);
  };

  const handleEditSave = () => {
    if (editTitle.trim()) {
      updateConversationTitle(editingId, editTitle.trim());
    }
    setEditingId(null);
    setEditTitle('');
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditTitle('');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <motion.div
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -300, opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={`sidebar ${theme}`}
    >
      <div className="sidebar-header">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={createNewConversation}
          className="new-chat-btn"
        >
          <SafeIcon icon={FiPlus} />
          New Chat
        </motion.button>
      </div>

      <div className="sidebar-search">
        <div className="search-container">
          <SafeIcon icon={FiSearch} className="search-icon" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <ModelSelector />

      <div className="sidebar-content">
        <div className="conversations-list">
          {filteredConversations.map((conv) => (
            <motion.div
              key={conv.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`conversation-item ${activeConversationId === conv.id ? 'active' : ''}`}
            >
              <div
                className="conversation-main"
                onClick={() => setActiveConversationId(conv.id)}
              >
                <SafeIcon icon={FiMessageSquare} className="conversation-icon" />
                <div className="conversation-info">
                  {editingId === conv.id ? (
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onBlur={handleEditSave}
                      onKeyPress={(e) => e.key === 'Enter' && handleEditSave()}
                      onKeyDown={(e) => e.key === 'Escape' && handleEditCancel()}
                      className="edit-input"
                      autoFocus
                    />
                  ) : (
                    <>
                      <div className="conversation-title">{conv.title}</div>
                      <div className="conversation-date">{formatDate(conv.createdAt)}</div>
                    </>
                  )}
                </div>
              </div>
              <div className="conversation-actions">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleEditStart(conv)}
                  className="action-btn"
                >
                  <SafeIcon icon={FiEdit2} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => deleteConversation(conv.id)}
                  className="action-btn delete"
                >
                  <SafeIcon icon={FiTrash2} />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;