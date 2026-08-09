import React from 'react';
import logo from './gemini-svg.svg'; // ReactComponent via vite-plugin-svgr
import {type User} from '../../auth/auth.interface';
import {useAuth} from '../../hooks/use-auth';
import {DropdownUser} from '../user';
import './header.scss';

export interface HeaderProps {
    isAuthenticated?: boolean;
    user?: User | null;
}

export const Header: React.FC<HeaderProps> = ({isAuthenticated, user}) => {
    const auth = useAuth();

    // Use passed props if available, otherwise fallback to useAuth hook
    const isUserAuth = isAuthenticated ?? Boolean(auth?.userProfile);
    const currentUser = user !== undefined ? user : auth?.userProfile;

    return (
        <header className="app-header">
            <div className="app-header__brand">
                <div className="app-header__logo">
                    <img src={logo} alt="TI Logo" />
                </div>
                <span className="app-header__title">
                    TI Knowledge Platform
                </span>
            </div>

            <div className="app-header__actions">
                <DropdownUser isAuthenticated={isUserAuth} user={currentUser}/>
            </div>
        </header>
    );
};