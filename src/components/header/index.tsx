import { Button } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import './header.scss';

export const Header = () => {
    const handleLogout = () => {
        // TODO: integrate with SSO logout
    };

    return (
        <header className="app-header">
            <div className="app-header__brand">
                <span className="app-header__title">
                    TI Knowledge Platform
                </span>
            </div>

            <div className="app-header__actions">
                <Button
                    type="text"
                    icon={<LogoutOutlined />}
                    onClick={handleLogout}
                >
                    Logout
                </Button>
            </div>
        </header>
    );
};

