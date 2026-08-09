import { useRouteError } from 'react-router-dom';
import { Header } from '../components/header';
import { Footer } from '../components/footer';
import notFound from './not-found.png';
import './not-found.scss';
import {useAuth} from "../hooks/use-auth.tsx";
import {isNull} from "../services/utils.service.ts";

export const ErrorPage = () => {
    const error: unknown = useRouteError();
    const auth = useAuth();
    const isAuthenticated = !isNull(auth?.userProfile);
    return (
        <div id="error-page" className="error-page">
            <Header isAuthenticated={isAuthenticated} user={auth?.userProfile} />
            <div className="flex align-center flex-col not-found justify-center p-16">
                <img alt="Page not found" src={notFound} className="not-found-img" />
                Sorry, an unexpected error has occurred.
                <p>
                    <i>{error instanceof Error ? error?.message : `Unknown error`}</i>
                </p>
            </div>
            <div className="footer-container">
                <Footer />
            </div>
        </div>
    );
};
