import React from 'react';
import { Alert } from 'antd';
import Logo from './gemini-svg.svg?react';
import { type User } from '../../auth/auth.interface';
import { useAuth } from '../../hooks/use-auth';
import { DropdownUser } from '../user';
import { useNetworkStore } from '../../store/network/network.store';
import './header.scss';

export interface HeaderProps {
    isAuthenticated?: boolean;
    user?: User | null;
}

export const Header: React.FC<HeaderProps> = ({ isAuthenticated, user }) => {
    const auth = useAuth();
    const isUserAuth = isAuthenticated ?? Boolean(auth?.userProfile);
    const currentUser = user !== undefined ? user : auth?.userProfile;

    const { hasNetworkError, clearNetworkError } = useNetworkStore();

    return (
        <>
            {/* Header Banner displayed on Network Failure */}
            {hasNetworkError && (
                <Alert
                    message="Network Error"
                    description="Unable to connect to backend service. Please check your network connection and try logging in again."
                    type="error"
                    showIcon
                    closable
                    onClose={clearNetworkError}
                    className="header-network-banner"
                />
            )}

            <header className="app-header">
                <div className="app-header__brand">
                    <div className="app-header__logo">
                        <Logo className="app-header__logo-svg" aria-label="TI Logo" />
                    </div>
                    <span className="app-header__title">TI Knowledge Platform</span>
                </div>

                <div className="app-header__actions">
                    <DropdownUser isAuthenticated={isUserAuth} user={currentUser} />
                </div>
            </header>
        </>
    );
};