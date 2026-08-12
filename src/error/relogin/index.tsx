import {Button} from 'antd';
import {refresh} from '../../auth/sso-auth';
import {LogoutOutlined} from '@ant-design/icons';
//import logout from './logout.png';
import './relogin.scss';
import {LogoutIllustration} from "./logout-illustration.tsx";

export const ReLogin = () => {
    return (
        <div className="flex flex-col align-center justify-center p-16 text-center">
            {/*<img alt="logout" src={logout}></img>*/}
            <div style={{maxWidth: 450, width: '100%', margin: '0 auto 24px'}}>
                <LogoutIllustration/>
            </div>
            <h4 className="error__description">You're logged out.</h4>
            <Button type="primary" onClick={(e) => refresh(e)} className="mt-05 login">
                <LogoutOutlined data-testid="logout-icon"/> Login
            </Button>
        </div>

        //         <div className="flex flex-col align-center justify-center p-16 text-center">
        //             <div style={{ maxWidth: 450, width: '100%', margin: '0 auto 24px' }}>
        //                 <LogoutIllustration />
        //             </div>
        //             <h2>You have been logged out</h2>
        //             <p className="text-secondary mb-16">
        //                 Your session has ended or the workspace has been closed.
        //             </p>
        //             <Button type="primary" size="large" onClick={() => navigate(ROUTE.ROOT)}>
        //                 Log In Again
        //             </Button>
        //         </div>
    );
};