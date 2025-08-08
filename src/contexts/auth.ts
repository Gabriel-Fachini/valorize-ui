import { createContext } from 'react'

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthContextType {
  user: User | null;
  login: () => Promise<void>;
  logout: () => Promise<void> | void;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)