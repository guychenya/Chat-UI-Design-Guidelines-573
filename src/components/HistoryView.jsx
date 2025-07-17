import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useChat } from '../contexts/ChatContext';
import { useTheme } from '../contexts/ThemeContext';
import './HistoryView.css';

const { 
  FiMessageSquare, FiCalendar, FiSearch, FiTrash2, 
  FiArchive, FiFilter, FiDownload, FiUpload 
} = FiIcons;

const HistoryView = () => {
  const { theme } = useTheme();
  const { conversations, setActiveConversationId, deleteConversation } = useChat();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [groupedConversations, setGroupedConversations] = useState({});
  const [selectedConversations, setSelectedConversations] = useState([]);

  // Group conversations by date
  useEffect(() => {
    const filtered = conversations.filter(conv => {
      const matchesSearch = conv.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        conv.messages.some(msg => msg.content.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesFilter = selectedFilter === 'all' || 
        (selectedFilter === 'archived' && conv.archived) ||
        (selectedFilter === 'active' && !conv.archived);

      return matchesSearch && matchesFilter;
    });

    const grouped = filtered.reduce((acc, conv) => {
      const date = new Date(conv.createdAt).toLocaleDateString();
      if (!acc[date]) acc[date] = [];
      acc[date].push(conv);
      return acc;
    }, {});

    // Sort conversations within each group by date (newest first)
    Object.keys(grouped).forEach(date => {
      grouped[date].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    });

    setGroupedConversations(grouped);
  }, [conversations, searchTerm, selectedFilter]);

  const handleExport = () => {
    const dataToExport = selectedConversations.length > 0 
      ? conversations.filter(conv => selectedConversations.includes(conv.id))
      : conversations;

    const exportData = {
      conversations: dataToExport,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-history-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target.result);
          // Here you would typically dispatch an action to merge the imported conversations
          console.log('Imported data:', importedData);
        } catch (error) {
          console.error('Error importing data:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString(undefined, { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    }
  };

  return (
    <div className={`history-view ${theme}`}>
      <div className="history-header">
        <h2>Chat History</h2>
        <div className="history-actions">
          <button className="action-btn" onClick={handleExport} title="Export conversations">
            <SafeIcon icon={FiDownload} />
            <span>Export</span>
          </button>
          <label className="action-btn" title="Import conversations">
            <SafeIcon icon={FiUpload} />
            <span>Import</span>
            <input 
              type="file" 
              accept=".json" 
              onChange={handleImport} 
              style={{ display: 'none' }}
            />
          </label>
        </div>
      </div>

      <div className="history-toolbar">
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

        <div className="filter-container">
          <button 
            className={`filter-btn ${selectedFilter === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedFilter('all')}
          >
            <SafeIcon icon={FiMessageSquare} />
            All
          </button>
          <button 
            className={`filter-btn ${selectedFilter === 'active' ? 'active' : ''}`}
            onClick={() => setSelectedFilter('active')}
          >
            <SafeIcon icon={FiFilter} />
            Active
          </button>
          <button 
            className={`filter-btn ${selectedFilter === 'archived' ? 'active' : ''}`}
            onClick={() => setSelectedFilter('archived')}
          >
            <SafeIcon icon={FiArchive} />
            Archived
          </button>
        </div>
      </div>

      <div className="conversations-container">
        {Object.entries(groupedConversations)
          .sort((a, b) => new Date(b[0]) - new Date(a[0]))
          .map(([date, convs]) => (
            <div key={date} className="conversation-group">
              <div className="group-header">
                <SafeIcon icon={FiCalendar} />
                <span>{formatDate(date)}</span>
              </div>
              <AnimatePresence>
                {convs.map((conv) => (
                  <motion.div
                    key={conv.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="conversation-item"
                  >
                    <div className="conversation-select">
                      <input
                        type="checkbox"
                        checked={selectedConversations.includes(conv.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedConversations([...selectedConversations, conv.id]);
                          } else {
                            setSelectedConversations(
                              selectedConversations.filter(id => id !== conv.id)
                            );
                          }
                        }}
                      />
                    </div>
                    <div 
                      className="conversation-content"
                      onClick={() => setActiveConversationId(conv.id)}
                    >
                      <div className="conversation-title">
                        {conv.title}
                      </div>
                      <div className="conversation-preview">
                        {conv.messages[conv.messages.length - 1]?.content.substring(0, 100)}...
                      </div>
                      <div className="conversation-meta">
                        <span>{new Date(conv.createdAt).toLocaleTimeString()}</span>
                        <span>{conv.messages.length} messages</span>
                      </div>
                    </div>
                    <div className="conversation-actions">
                      <button
                        className="action-btn delete"
                        onClick={() => deleteConversation(conv.id)}
                        title="Delete conversation"
                      >
                        <SafeIcon icon={FiTrash2} />
                      </button>
                      <button
                        className="action-btn archive"
                        onClick={() => {
                          // Toggle archive status
                          // You would implement this in your chat context
                          console.log('Toggle archive for:', conv.id);
                        }}
                        title={conv.archived ? "Unarchive conversation" : "Archive conversation"}
                      >
                        <SafeIcon icon={FiArchive} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ))}

        {Object.keys(groupedConversations).length === 0 && (
          <div className="no-results">
            <SafeIcon icon={FiMessageSquare} className="no-results-icon" />
            <p>No conversations found</p>
            {searchTerm && (
              <p className="no-results-hint">
                Try adjusting your search or filters
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryView;