import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useTheme } from '../contexts/ThemeContext';
import './FileDropzone.css';

const { FiUploadCloud } = FiIcons;

const FileDropzone = forwardRef(({ onDragLeave, onDrop }, ref) => {
  const { theme } = useTheme();

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onDragLeave();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const { files } = e.dataTransfer;
    if (files && files.length > 0) {
      onDrop(files);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`file-dropzone ${theme}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      ref={ref}
    >
      <div className="dropzone-content">
        <div className="upload-icon">
          <SafeIcon icon={FiUploadCloud} />
        </div>
        <h3>Drop files to upload</h3>
        <p>Share documents, images, or other files</p>
      </div>
    </motion.div>
  );
});

export default FileDropzone;