
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { admins } from '@/lib/admins';
import type { User } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // On initial load, check if user info is in sessionStorage
    if (typeof window !== 'undefined') {
        const storedUser = sessionStorage.getItem('user');
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch (e) {
            console.error("Failed to parse user from sessionStorage", e);
            sessionStorage.removeItem('user');
          }
        }
    }
  }, []);

  const login = (email: string, password: string): boolean => {
    const adminUser = admins.find(
      (admin) => admin.email === email && admin.password === password
    );

    if (adminUser) {
      const userData = { email: adminUser.email };
      setUser(userData);
      if (typeof window !== 'undefined') {
          sessionStorage.setItem('user', JSON.stringify(userData));
      }
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
     if (typeof window !== 'undefined') {
        sessionStorage.removeItem('user');
     }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
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
