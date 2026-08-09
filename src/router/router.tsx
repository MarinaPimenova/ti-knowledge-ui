import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import {ROUTE} from './router.enum';
import {ErrorPage} from '../error';
import {BaseNetworkError} from '../error/network';
import {LandingLayout} from '../landing/landing-layout';
import {ReLogin} from '../error/relogin/index';
import {PublicLayout} from '../landing/public-layout';
import {Question} from '../question/index';
import {Project} from '../project/index';
import type {ErrorInfo} from 'react';
import Fallback from '../error/fallback';
import {ErrorBoundary} from 'react-error-boundary';
import {QuestionCreate} from '../question/question-create';

export const Routes = () => {
    // Define routes accessible only to authenticated users
    const authenticatedRoutes = [
        {
            path: ROUTE.ROOT,
            element: <LandingLayout/>, // Wrap the component in Protected LandingLayout
            errorElement: <ErrorPage/>,
            children: [
                {path: ROUTE.QUESTIONS, element: <Question/>},
                {path: ROUTE.PROJECTS, element: <Project/>},
            ],
        },
    ];

    // Define routes accessible only to non-authenticated users
    const publicRoutes = [
        {
            path: ROUTE.RE_LOGIN,
            element: <PublicLayout/>, // Wrap the component in Protected LandingLayout
            errorElement: <ErrorPage/>,
            children: [{path: ROUTE.RE_LOGIN, element: <ReLogin/>}],
        },
    ];

    const recoverRoutes = [
        {
            path: ROUTE.ERROR,
            element: <PublicLayout/>, // Wrap the component in Public PublicLayout
            errorElement: <ErrorPage/>,
            children: [
                {path: ROUTE.ERROR, element: <BaseNetworkError/>},
                {path: ROUTE.ERROR_CODE, element: <BaseNetworkError/>}],
        },
    ];
    // Combine and conditionally include routes based on authentication status
    const router = createBrowserRouter([...publicRoutes, ...authenticatedRoutes, ...recoverRoutes], {
        basename: '/dashboard-page',
        future: {
            v7_relativeSplatPath: true,
        },
    });

    return (
        <ErrorBoundary
            FallbackComponent={Fallback}
            onReset={() => {
                /* reset the state of your app here*/
            }}
            resetKeys={['someKey']}
            onError={logErrorToService}
        >
            <RouterProvider
                router={router}
                future={{
                    v7_startTransition: true,
                }}
            />
        </ErrorBoundary>
    );
};

// Error logging function
function logErrorToService(error: Error, info: ErrorInfo) {
    // Use your preferred error logging service
    console.error('Caught an error:', error, info);
}

