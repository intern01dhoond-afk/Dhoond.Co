import React, { createContext, useContext, useState } from 'react';

const UIContext = createContext();

export const UIProvider = ({ children }) => {
  const [showComingSoon, setShowComingSoon] = useState(false);

  const openComingSoon = () => setShowComingSoon(true);
  const closeComingSoon = () => setShowComingSoon(false);

  return (
    <UIContext.Provider value={{ showComingSoon, openComingSoon, closeComingSoon }}>
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) throw new Error('useUI must be used within a UIProvider');
  return context;
};
