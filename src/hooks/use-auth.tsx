import { useContext } from 'react';
import type { AuthContextType } from '../auth/auth.interface';
import { AuthContext } from '../auth/auth-context';

export function useAuth(): AuthContextType | undefined {
    return  useContext(AuthContext);
}