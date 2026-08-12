// src/components/user/index.tsx
import React, {useState} from 'react';
import {DownOutlined, LogoutOutlined, LoginOutlined} from '@ant-design/icons';
import {Dropdown, type MenuProps, Space, Button} from 'antd';
import {useNavigate} from 'react-router-dom';
import {useAuth} from '../../hooks/use-auth';
import type {AuthContextType, User} from '../../auth/auth.interface';
import {getUserName} from '../../utils/user-util';
import {ROUTE} from '../../router/router.enum';
import {isNull} from '../../services/utils.service';
import {useNetworkStore} from '../../store/network/network.store';
import {restApi} from '../../services/axios.config';

interface DropdownUserProps {
    isAuthenticated?: boolean;
    user?: User | null;
}

export const DropdownUser: React.FC<DropdownUserProps> = ({isAuthenticated, user}) => {
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

    const checkBackendHealth = async (): Promise<boolean> => {
        try {
            await restApi.get('/actuator/health', {
                timeout: 3000,
                skipAuthRedirect: true, // <--- Add this flag!
            } as any);
            return true;
        } catch (error: any) {
            console.error('check be health failed - be is not available')
            return false;
        }
    };

    const handleLoginClick = async () => {
        if (isNull(auth)) return;

        setIsLoading(true);
        setNetworkError(false);

        // 1. Verify BE connectivity
        const isBackendAlive = await checkBackendHealth();

        if (!isBackendAlive) {
            setNetworkError(true);
            setIsLoading(false);
            return;
        }

        // 2. Trigger redirect to Okta initiation endpoint
        auth?.onLogin();
    };

    const items: MenuProps['items'] = [
        {
            label: 'Logout',
            key: 'logout',
            icon: <LogoutOutlined/>,
            onClick: handleLogoutClick,
        },
    ];

    if (!isAuth) {
        return (
            <Button
                type="primary"
                icon={<LoginOutlined/>}
                loading={isLoading}
                disabled={isLoading}
                onClick={handleLoginClick}
            >
                {isLoading ? 'Connecting...' : 'Login'}
            </Button>
        );
    }

    return (
        <Dropdown menu={{items}} trigger={['click']}>
            <div aria-hidden className="cursor-pointer">
                <Space className="username-space">
                    {getUserName(userProfile)}
                    <DownOutlined className="down-outlined"/>
                </Space>
            </div>
        </Dropdown>
    );
};