import type {User} from '../auth/auth.interface';
import {refresh} from '../auth/sso-auth';
import {Button} from 'antd';
import {LoginOutlined} from '@ant-design/icons';
import {isNull} from '../services/utils.service';

export const login = (
    <Button type="link" className="login" onClick={(event) => refresh(event)}>
        <LoginOutlined/> Login
    </Button>
);

export const getUserName = (user: User | null | undefined) => {
    if (!isNull(user)) {
        return <>{`${user?.family_name}, ${user?.given_name}`}</>;
    }
    return <>Login</>;
};