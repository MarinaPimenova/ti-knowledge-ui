import React, { useState } from 'react';
import { DownOutlined, LogoutOutlined, LoginOutlined } from '@ant-design/icons';
import { Dropdown, type MenuProps, Space, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/use-auth';
import type { AuthContextType, User } from '../../auth/auth.interface';
import { getUserName } from '../../utils/user-util';
import { ROUTE } from '../../router/router.enum';
import { isNull } from '../../services/utils.service';
import { useNetworkStore } from '../../store/network/network.store';

interface DropdownUserProps {
    isAuthenticated?: boolean;
    user?: User | null;
}

export const DropdownUser: React.FC<DropdownUserProps> = ({ isAuthenticated, user }) => {
    const auth: AuthContextType | undefined = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const setNetworkError = useNetworkStore((state) => state.setNetworkError);

    const isAuth = isAuthenticated ?? Boolean(auth?.userProfile);
    const userProfile = user !== undefined ? user : auth?.userProfile;

    const handleLogoutClick = () => {
        auth?.onLogout(() => {
            sessionStorage.clear();
            navigate(ROUTE.ROOT);
        });
    };

    const handleLoginClick = async () => {
        if (isNull(auth)) return;

        // 1. Disable button during login attempt
        setIsLoading(true);

        try {
            await auth.onLogin();
            // Clear any previous banner on success
            setNetworkError(false);
            navigate(ROUTE.ROOT);
        } catch (error) {
            console.error('Login or network error:', error);

            // 2. Trigger header network error banner
            setNetworkError(true);
        } finally {
            // 3. Re-enable button immediately so user can retry
            setIsLoading(false);
        }
    };

    const items: MenuProps['items'] = [
        {
            label: 'Logout',
            key: 'logout',
            icon: <LogoutOutlined />,
            onClick: handleLogoutClick,
        },
    ];

    if (!isAuth) {
        return (
            <Button
                type="primary"
                icon={<LoginOutlined />}
                loading={isLoading}
                disabled={isLoading} // Button is disabled while attempting login
                onClick={handleLoginClick}
            >
                {isLoading ? 'Signing in...' : 'Login'}
            </Button>
        );
    }

    return (
        <Dropdown menu={{ items }} trigger={['click']}>
            <div aria-hidden className="cursor-pointer">
                <Space className="username-space">
                    {getUserName(userProfile)}
                    <DownOutlined className="down-outlined" />
                </Space>
            </div>
        </Dropdown>
    );
};