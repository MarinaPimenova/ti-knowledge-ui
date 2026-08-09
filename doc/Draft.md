You are React, React-dom, React-router expert.

Please help me generate "public landing layout component" for 
"Training Internal Knowledge Platform" that could be like the following:
```text
┌─────────────────────────────────────────────────────────────────────┐
│ TI Knowledge Platform                              👤 Sig in ▾      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Knowledge Dashboard                                                │
│  Find, review and manage internal technical knowledge               │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ 🔍 Search questions and short answers...                      │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                     │
│   💬 Ask AI    ⬆ Import    ⬇ Export    New Question                 │
│                                                                     │
│  ┌────────────────┐ ┌────────────────┐ ┌────────────────────────┐   │
│  │    Projects    │ │ Questions      │ │ Knowledge Base         │   │
│  │      4         │ │      37        │ │       248              │   │
│  └────────────────┘ └────────────────┘ └────────────────────────┘   │
│                                                                     │
│  Recently Added Questions                                           │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ What is a Java Record?                                        │  │
│  │ Java • A2 • Updated today                                     │  │
│  │ "A record is a compact syntax for declaring..."               │  │
│  ├───────────────────────────────────────────────────────────────┤  │
│  │ Explain OAuth2 Authorization Code Flow                        │  │
│  │ Security • A3 • Updated yesterday                             │  │
│  │ "Authorization Code Flow allows..."                           │  │
│  ├───────────────────────────────────────────────────────────────┤  │
│  │ Explain the Circuit Breaker pattern                           │  │
│  │ Resilience • A4 • Updated 2 days ago                          │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

After a user logged in, the user is able to see the following:
```text
┌─────────────────────────────────────────────────────────────────────┐
│ TI Knowledge Platform                              👤 User ▾        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Knowledge Dashboard                                                │
│  Find, review and manage internal technical knowledge               │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ 🔍 Search questions and short answers...              [Search]│  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  [ 💬 Ask AI ]   [ ⬆ Import ]   [ ⬇ Export ]   [ + New Question ]   │
│                                                                     │
│  ┌────────────────┐ ┌────────────────┐ ┌────────────────────────┐   │
│  │ My Projects    │ │ My Questions   │ │ Knowledge Base         │   │
│  │      4         │ │      37        │ │       248              │   │
│  └────────────────┘ └────────────────┘ └────────────────────────┘   │
│                                                                     │
│  My Projects                                      [View all]        │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ Java Training                                    24 questions │  │
│  │ Spring Boot                                      31 questions │  │
│  │ Architecture                                     18 questions │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  Recently Added Questions                          [View all]       │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ What is a Java Record?                                        │  │
│  │ Java • A2 • Updated today                                     │  │
│  │ "A record is a compact syntax for declaring..."               │  │
│  ├───────────────────────────────────────────────────────────────┤  │
│  │ Explain OAuth2 Authorization Code Flow                        │  │
│  │ Security • A3 • Updated yesterday                             │  │
│  │ "Authorization Code Flow allows..."                           │  │
│  ├───────────────────────────────────────────────────────────────┤  │
│  │ Explain the Circuit Breaker pattern                           │  │
│  │ Resilience • A4 • Updated 2 days ago                          │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```
So, I see the flow like:
1. User Opens http://localhost:3000/dashboard-page (I configure vite.config.ts like: base: '/dashboard-page',  // Set the base URL for the app) and "Landing-page concept for not logged-in users" is displayed.
   And user cannot proceed with app without Sign-in or Sign-up.
2. Once the user logged-in then the "landing-page concept after log-in" is displayed and more functionalities are available for the user.

For the logged-in user I see the following flows:
when user click on:
-Ask AI -> the user is redirected to a separate SPA
-Import -> pop-up window for file selection should be shown. At the same time user can select only one file. Only CSV and Excel formats are supported. Maybe display status of import somewhere not blocking user interaction with app. Once import completes show pop-up: Import completes. The SSE should be used for Import processing.
-Export -> export layout should be displayed instead of landing-layout - like:
```text
┌─────────────────────────────────────────────────────────────────────┐
│ <TI Logo> TI Knowledge Platform                    👤 User ▾        │
├─────────────────────────────────────────────────────────────────────┤
│  Export                                                             │
|                                                                     |
|  -Select or Find project to export                                  |
|  -Select or Find questions to export                                |
|                                                                     |
|_____________________________________________________________________|
│Footer                                                               │
└─────────────────────────────────────────────────────────────────────┘
```
Only CSV and Excel formats are supported. Maybe display status of Export somewhere not blocking user interaction with app. Once Export completes show pop-up: Export completes. The SSE should be used for Export processing.
- New Question -> "Create question" layout should be displayed instead of landing-layout with  the following fields to fill-in:
  question: string; // mandatory
  shortAnswer: string; // mandatory
  resourceUrl: string;
  description: string; // resource's description

either resourceUrl or description should not be empty.

- View All Projects -> "All Projects"   layout should be displayed instead of landing-layout. Maybe like table with following columns:
  -Project name;
  -Count of questions in project.
----
- View All Questions -> "All Questions"  layout should be displayed instead of landing-layout. Maybe like table with the following columns:
  question: string;
  shortAnswer: string;
  tag: string;
  projectName: string;
  resourceUrl: string;
  description: string; // resource's description

Please help me align the following Routes configuration according to the above logic.
Please provide reasoning for your solutions.

Find below the code:
```javascript - router.tsx
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
```

```javascript - router.enum.ts
export const ROUTE = {
    ROOT: '/',
    DASHBOARD: '/dashboard-page',
    QUESTIONS: '/questions',
    CREATE_QUESTION: '/question',
    PROJECTS: '/projects',
    CREATE_PROJECT: '/project',
    IMPORT: '/import',
    ADMIN: '/admin',
    ERROR: '/error',
    ERROR_CODE: '/error/:code',
    RE_LOGIN: '/relogin'

} as const;

export type Route = typeof ROUTE[keyof typeof ROUTE];
```

```javascript - landing-layout.tsx
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
```

```javascript - public-layout.tsx
import {Outlet} from 'react-router-dom';
import {PublicHeader} from '../components/header/public-header';
import {ScrollToTop} from '../components/scroll-to-top';

export const PublicLayout = () => {

    let content = (<>
            <ScrollToTop/>
            <PublicHeader/>
            <div className="container">
                <div className="content">
                    <Outlet/>
                </div>
            </div>
        </>
    );

    return (<>{content}</>);
};
```

So, the current implementation of "landing-layout.tsx" anf router.tsx performs immediate redirect to log-in,
but I think it makes sense to show to user some functionality of the platform and user can log-in or not.

and 
```javascript - public-header.tsx
import { Logo } from './assets/ti-logo.svg';
import { login } from '../../utils/user-util';
import './header.scss';

export const PublicHeader = () => {
    return (
        <header className="header" data-testid="header">
            <div className="nav">
                <div className="flex align-center">
                    <div className="header_logo" data-testid="ti-logo">
                        <Logo />
                    </div>
                </div>
                {login}
            </div>
        </header>
    );
};
```

and 

```javascript - header-index.tsx
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
```

---

please generate project/project-create.tsx according to the description:
"Create project" layout should be displayed instead of landing-layout with  the following fields to fill-in:
project name: string; // mandatory
project lead: string; // mandatory
and below table of all questions that can be assigned to this project
and buttons Create, Cancel.
It's not mandatory to select any questions, so project can be empty.
if it needs please create project-create.scss

---

please help me fix the following issues :
- TS2307: Cannot find module '../../store/notify/notify.store' or its corresponding type declarations.
- TS7006: Parameter 'state' implicitly has an 'any' type.
---

in the code:
import { useEffect, useRef, useState } from 'react';
import { setupInterceptors } from '../../services/axios.config';
import { notification } from 'antd';
import { useNotifyStore } from '../../store/notify/notify.store';
import { useNavigate } from 'react-router-dom';

export const Interceptor = () => {
// Use useRef to prevent a re-render in the useEffect.
// A ref, cannot be used as a useEffect dependency, hence,
// your linters shouldn't complain about missing dependencies.
const navRef = useRef(useNavigate())

    const [ran, setRan] = useState(false);
    const [api, contextHolder] = notification.useNotification();
    const updateNotifyApi = useNotifyStore((state) => state.updateNotifyApi);

    useEffect(() => {
        if (!ran) {
            setupInterceptors(navRef, api);
            setRan(true);
            updateNotifyApi(api);
        }
    }, [ran, api]);
    return <>{contextHolder}</>;
};

---
if interceptor/index.tsx is used in the following code:
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