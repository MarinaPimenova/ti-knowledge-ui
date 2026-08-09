import React, { useMemo, useState } from 'react';
import type { User } from './auth.interface';

import { AuthContext } from './auth-context';
import { reset, ssoAuthProvider } from './sso-auth';

// Uncaught Error: Objects are not valid as a React child (found: [object Promise]).
// If you meant to render a collection of children, use an array instead.
function AuthProvider({ children }: Readonly<{ children: React.ReactNode }>) {
    const [userProfile, setUserProfile] = useState<User>();

    const setUser = (newUser: User | undefined) => {
        setUserProfile(newUser);
    };

    const onLogin = () => {
        ssoAuthProvider.getUserProfile((data) => {
            if (data.data !== null && data.data !== undefined) {
                const authenticatedUser: User = {
                    email: data.data.email,
                    family_name: data.data.family_name,
                    given_name: data.data.given_name,
                    roles: data.data.roles,
                    username: data.data.username,
                    registered: data.data.registered,
                };
                setUser(authenticatedUser);
            } else {
                setUser(undefined);
                throw new Error(`${data.error?.message}`);
            }
        });
    };

    const onLogout = (callback: VoidFunction) => {
        setUser(undefined);
        callback();
        reset();
    };

    // The useMemo hook allows for a value to be cached and only updated when the dependency changes.
    const value = useMemo(() => ({ userProfile, onLogin, onLogout }), [userProfile, onLogin, onLogout]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
