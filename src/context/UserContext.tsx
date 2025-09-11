import React, { createContext, useContext, useEffect, useState } from 'react';

const UserContext = createContext(null);

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [data, setData] = useState(null);
  const [isExpired, setIsExpired] = useState(null)

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.log(err);

      }
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, data, setData ,isExpired, setIsExpired}}>
      {children}
    </UserContext.Provider>
  );
};
