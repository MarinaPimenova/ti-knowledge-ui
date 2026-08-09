import React from 'react';
import { Button } from 'antd';
import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { type User } from '../../auth/auth.interface'; // Adjust path to your User interface/type
import './header.scss';

// 1. Define the props interface
export interface HeaderProps {
    isAuthenticated: boolean;
    user?: User | null;
}

// 2. Pass HeaderProps to the component
export const Header: React.FC<HeaderProps> = ({ isAuthenticated, user }) => {
    const handleLogout = () => {
        // TODO: integrate with SSO logout
    };

    const handleLogin = () => {
        // TODO: integrate with SSO login / redirect
    };

    return (
        <header className="app-header">
            <div className="app-header__brand">
                <span className="app-header__title">
                    TI Knowledge Platform
                </span>
            </div>

            <div className="app-header__actions">
                {isAuthenticated ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span>
                            <UserOutlined /> {user?.given_name || user?.family_name || 'User'}
                        </span>
                        <Button
                            type="text"
                            icon={<LogoutOutlined />}
                            onClick={handleLogout}
                        >
                            Logout
                        </Button>
                    </div>
                ) : (
                    <Button type="primary" onClick={handleLogin}>
                        Sign in
                    </Button>
                )}
            </div>
        </header>
    );
};