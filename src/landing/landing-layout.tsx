// landing-layout.tsx
import { Outlet } from 'react-router-dom';
import { Header } from '../components/header';
import { Footer } from '../components/footer';
import { Interceptor } from '../components/interceptor';
import { ScrollToTop } from '../components/scroll-to-top';
import { useAuth } from '../hooks/use-auth';
import { isNull } from '../services/utils.service';
import './landing.scss';

export const LandingLayout = () => {
    const auth = useAuth();
    const isAuthenticated = !isNull(auth?.userProfile);

    return (
        <div className="app-layout">
            <Interceptor />
            <ScrollToTop />
            <Header isAuthenticated={isAuthenticated} user={auth?.userProfile} />
            <main className="container">
                <div className="content">
                    <Outlet />
                </div>
            </main>
            <Footer />
        </div>
    );
};