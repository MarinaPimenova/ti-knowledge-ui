import React, {useMemo, useState, useEffect, useCallback} from 'react';
import type {User} from './auth.interface';
import {AuthContext} from './auth-context';
import {reset, ssoAuthProvider, login} from './sso-auth';

// Uncaught Error: Objects are not valid as a React child (found: [object Promise]).
// If you meant to render a collection of children, use an array instead.
function AuthProvider({children}: Readonly<{ children: React.ReactNode }>) {
    const [userProfile, setUserProfile] = useState<User | undefined>(undefined);

    // @ts-ignore
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const setUser = (newUser: User | undefined) => {
        setUserProfile(newUser);
    };

    // Helper method to fetch profile from Gateway
    const fetchUserProfile = useCallback(() => {
        ssoAuthProvider.getUserProfile((data) => {
            if (data.data) {
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
                // User is not authenticated or session expired - set to undefined gracefully
                setUser(undefined);
            }
            setIsLoading(false);
        });
    }, []);

    // 1. Check authentication state on initial application load (Scenario 1 & 3)
    useEffect(() => {
        fetchUserProfile();
    }, [fetchUserProfile]);

    // 2. Trigger explicit login redirect (Scenario 4)
    const onLogin = () => {
        login(); // Redirects browser to /oauth2/authorization/okta
    };

// 3. Trigger logout (Scenario 6)
    const onLogout = (callback: VoidFunction) => {
        setUser(undefined);
        callback();
        reset();
    };

    // The useMemo hook allows for a value to be cached and only updated when the dependency changes.
    const value = useMemo(
        () => ({userProfile, onLogin, onLogout}),
        [userProfile, onLogin, onLogout]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
