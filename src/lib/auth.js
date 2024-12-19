import { createContext, useContext, useState } from 'react';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const signIn = async (username, password) => {
    try {
      // Check against environment variables
      if (
        username === process.env.NEXT_PUBLIC_ADMIN_USERNAME &&
        password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD
      ) {
        setUser({ username });
        return { error: null };
      }
      throw new Error('Invalid credentials');
    } catch (error) {
      return { error };
    }
  };

  const signOut = async () => {
    setUser(null);
    return { error: null };
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
