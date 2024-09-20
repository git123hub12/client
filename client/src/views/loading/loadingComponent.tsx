import React from 'react';
import styles from './loadingComponent.module.css'; // Import the CSS file

interface LoadingOverlayProps {
  isLoading: boolean;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isLoading }) => {
  return isLoading ? (
    <div className={styles.loadingOverlay}>
      <div className={styles.loadingSymbol}></div>
    </div>
  ) : null;
};

export default LoadingOverlay;
