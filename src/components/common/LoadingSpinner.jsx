// src/components/common/LoadingSpinner.jsx
import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = () => {
  return (
    <div className="loading-spinner-container">
      <div className="loading-spinner"></div>
      <p className="loading-text">جاري التحميل...</p>
    </div>
  );
};

export default LoadingSpinner;