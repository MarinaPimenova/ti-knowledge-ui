import React from 'react';
import type { AuthContextType } from './auth.interface';

const initialState: AuthContextType = {
    userProfile: undefined,
    onLogin: () => {},
    onLogout: () => {},
};

export const AuthContext = React.createContext<AuthContextType>(initialState);
