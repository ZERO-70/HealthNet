import React from 'react';
import ReactDOM from 'react-dom';
import '../index.css'; // spinner styles

/**
 * LoadingSpinner displays a centered loading spinner overlay.
 *
 * Usage:
 *   <LoadingSpinner />
 *
 * Styles are defined in index.css (spinner-overlay, spinner).
 */
const LoadingSpinner = () => {
  const overlay = (
    <div className="spinner-overlay">
      <div className="spinner" />
    </div>
  );
  return ReactDOM.createPortal(overlay, document.body);
};

export default LoadingSpinner;
