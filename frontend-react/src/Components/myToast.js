import React from 'react';

export default function MyToast({ children }) {
  const { show, message, type } = children;
  if (!show) return null;

  return (
    <div className={`toast-pro toast-pro-${type}`}>
      <div className="toast-pro-icon">
        {type === 'success' ? '✓' : '✕'}
      </div>
      <span>{message}</span>
    </div>
  );
}
