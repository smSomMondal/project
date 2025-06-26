import { createContext, useEffect, useState,useContext } from "react";

// Create the context
export const UserContext = createContext();


const setTokenWithExpiry = (key, token, ttl) => {
  const now = new Date();
  const item = {
    token: token,
    expiry: now.getTime() + ttl, // ttl = time to live in ms
  };
  localStorage.setItem(key, JSON.stringify(item));
};



// Create the provider component
export const UserProvider = ({ children }) => {
  const [userType, setUserType] = useState();


  
  function login(data) {
    setTokenWithExpiry("token", data.token, 3600000*24);
    localStorage.setItem("user", JSON.stringify(data));
    setUserType(data.userType);
    // navigator("/products");
  }
  function logOut() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserType(parsedUser.userType);
    }
  }, []);
  return (
    <UserContext.Provider value={{ userType, setUserType, login,logOut }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);