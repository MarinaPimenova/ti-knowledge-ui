import React from 'react';
import { DownOutlined, LogoutOutlined } from '@ant-design/icons';
import { Dropdown, type MenuProps, Space } from 'antd';
import { useAuth } from '../../hooks/use-auth';
import type { AuthContextType } from '../../auth/auth.interface';
import { getUserName } from '../../utils/user-util';

export const DropdownUser: React.FC = () => {
    const auth: AuthContextType | undefined = useAuth();

    const handleLogoutClick = () => {
        auth?.onLogout(() => {sessionStorage.clear();})
    };

    const items: MenuProps['items'] = [
        {
            label: 'Logout',
            key: '1',
            icon: <LogoutOutlined />,
            onClick: () => handleLogoutClick(),
        },
    ];

    return (
        <Dropdown menu={{ items }} trigger={['click']}>
            <div aria-hidden className="cursor-pointer">
                <Space className='username-space'>
                    {getUserName(auth?.userProfile)}
                    <DownOutlined className='down-outlined'/>
                </Space>
            </div>
        </Dropdown>
    );
};
