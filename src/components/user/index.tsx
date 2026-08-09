import React from 'react';
import {DownOutlined, LogoutOutlined, LoginOutlined} from '@ant-design/icons';
import {Dropdown, type MenuProps, Space, Button} from 'antd';
import {useNavigate} from 'react-router-dom';
import {useAuth} from '../../hooks/use-auth';
import type {AuthContextType, User} from '../../auth/auth.interface';
import {getUserName} from '../../utils/user-util';
import {ROUTE} from '../../router/router.enum';

interface DropdownUserProps {
    isAuthenticated?: boolean;
    user?: User | null;
}

export const DropdownUser: React.FC<DropdownUserProps> = ({isAuthenticated, user}) => {
    const auth: AuthContextType | undefined = useAuth();
    const navigate = useNavigate();

    const isAuth = isAuthenticated ?? Boolean(auth?.userProfile);
    const userProfile = user !== undefined ? user : auth?.userProfile;

    const handleLogoutClick = () => {
        auth?.onLogout(() => {
            sessionStorage.clear();
        });
    };

    const handleLoginClick = () => {
        navigate(ROUTE.RE_LOGIN);
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
                onClick={handleLoginClick}
            >
                Login
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