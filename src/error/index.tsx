import { useRouteError } from 'react-router-dom';
import { Header } from '../components/header';
import { Footer } from '../components/footer';
import notFound from './not-found.png';
import './not-found.scss';

export const ErrorPage = () => {
    const error: unknown = useRouteError();

    return (
        <div id="error-page" className="error-page">
            <Header />
            <div className="flex align-center flex-col not-found justify-center p-16">
                <img alt="not-found" src={notFound} className="not-found-img" />
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
