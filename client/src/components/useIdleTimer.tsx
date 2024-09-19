import { useState, useEffect } from 'react';

const useIdleTimer = (
  timeout: number,
  onIdle: () => void,
  activePages: string[],
  isRecording: boolean,
  currentPath: string
) => {
  const [isActivePage, setIsActivePage] = useState(false);

  useEffect(() => {
    setIsActivePage(activePages.includes(currentPath));
  }, [currentPath, activePages]);

  useEffect(() => {
    if (!isActivePage || isRecording) return; // Skip timer if recording

    let timer: NodeJS.Timeout;
    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(onIdle, timeout);
    };

    const events = ['mousemove', 'keydown', 'scroll', 'click'];

    events.forEach(event => window.addEventListener(event, resetTimer));
    resetTimer(); // Start timer on mount

    return () => {
      clearTimeout(timer);
      events.forEach(event => window.removeEventListener(event, resetTimer));
    };
  }, [timeout, onIdle, isActivePage, isRecording]);
};

export default useIdleTimer;
