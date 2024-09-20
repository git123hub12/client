import React, { useState } from 'react';
import styles from './toggleButton.module.css';

const ToggleButton: React.FC = () => {
  const [isToggled, setToggled] = useState<boolean>(false);

  const handleToggle = () => {
    setToggled(!isToggled);
  };

  return (
    <div className={styles.mainContainer}>
      <button className={styles.ToggleButton} onClick={handleToggle}>
        {isToggled ? 'Toggle Off' : 'Toggle On'}
      </button>
      {isToggled && <p>Toggle is ON</p>}
    </div>
  );
};

export default ToggleButton;
