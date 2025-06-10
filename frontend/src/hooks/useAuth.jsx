// hooks/userAuth.jsx
import { useContext } from 'react';
import { AuthProvider } from '../contexts/AuthContext';

export function useAuth() {
  const authContext = AuthProvider();
  return useContext(authContext);
}
