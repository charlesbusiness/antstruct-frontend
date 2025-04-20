import React, { createContext, useContext } from "react";
import useBusinessProfile from "../hooks/useBusinessProfile";

const BusinessProfileContext = createContext(null);

export const BusinessProfileProvider = ({ children }) => {
  const profileData = useBusinessProfile();

  return (
    <BusinessProfileContext.Provider value={profileData}>
      {children}
    </BusinessProfileContext.Provider>
  );
};

// Custom hook to use the profile anywhere
export const useBusinessProfileContext = () => {
  const context = useContext(BusinessProfileContext);
  if (!context) {
    throw new Error("useBusinessProfileContext must be used within BusinessProfileProvider");
  }
  return context;
};
