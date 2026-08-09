import {useLayoutEffect} from 'react';
import {Header} from '../components/header';
import {Interceptor} from '../components/interceptor';
import {Outlet, useNavigate} from 'react-router-dom';
import {Footer} from '../components/footer/index';
import type {AuthContextType} from '../auth/auth.interface';
import {useAuth} from '../hooks/use-auth';
import {isNull} from '../services/utils.service';
import {ScrollToTop} from '../components/scroll-to-top';
import {ROUTE} from '../router/router.enum';
import './landing.scss';

export const LandingLayout = () => {
    const navigate = useNavigate();
    const auth: undefined | AuthContextType = useAuth();
    useLayoutEffect(() => {
        if (!isNull(auth)) {
            auth?.onLogin();
        }
    }, []);

    // Redirect after authentication success
    useLayoutEffect(() => {
        if (!isNull(auth?.userProfile)) {
            navigate(ROUTE.DASHBOARD);
        }
    }, [auth?.userProfile]);

    let content = <></>;

    if (!isNull(auth?.userProfile)) {
        content = (<>
                <Interceptor/>
                <ScrollToTop/>
                <Header/>
                <div className="container">
                    <div className="content">
                        <Outlet/>
                    </div>
                    <Footer/>
                </div>
            </>
        );
    }

    return (<>{content}</>);
};
