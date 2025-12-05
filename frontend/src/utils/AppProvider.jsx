import React, { createContext, useState } from "react";

// Create the context
export const AppContext = createContext();

// Create a provider component
export const AppProvider = ({ children }) => {
  const [isAuth, setIsAuth] = useState(false);
  const [userData, setUserData] = useState({});

  return (
    <AppContext.Provider value={{ isAuth, setIsAuth, userData, setUserData }}>
      {children}
    </AppContext.Provider>
  );
};
