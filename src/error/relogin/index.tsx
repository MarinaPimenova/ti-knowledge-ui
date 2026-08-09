import { Button } from 'antd';
import { refresh } from '../../auth/sso-auth';
import { LogoutOutlined } from '@ant-design/icons';
import logout from './logout.png';
import './relogin.scss';

export const ReLogin = () => {
    return (
        <div className="error__content flex flex-col align-center justify-center">
            <img alt="logout" src={logout}></img>
            <h4 className="error__description">You're logged out.</h4>
            <Button type="primary" onClick={(e) => refresh(e)} className="mt-05 login">
                <LogoutOutlined data-testid="logout-icon" /> Login
            </Button>
        </div>
    );
};