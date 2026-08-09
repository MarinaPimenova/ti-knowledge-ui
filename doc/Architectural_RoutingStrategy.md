To align your application routes and component architecture 
with these requirements, 
we need to restructure **Route handling**, **Layout composition**, 
and **Dashboard presentation logic**.

---

## 1. Architectural & Routing Strategy

### The Core Problem

Previously, non-authenticated users were immediately blocked 
or redirected away from the dashboard (`ROUTE.ROOT`). 
However, your public landing requirements demand that **both public and authenticated users view the Dashboard on the root route (`/`)**, with feature sets conditionally toggled depending on session state.

### The Solution Strategy

1. **Unified Dashboard Route (`/`):** Place the Dashboard at `ROUTE.ROOT`. The Dashboard component will render public preview cards (no action buttons, no private projects) when logged out, and authenticated features (action controls, "My Projects", "View All" links) when logged in.
2. **`ProtectedLayout` Guard:** Wrap explicit sub-features (`/questions`, `/projects`, `/question/create`, `/export`) in an authentication boundary. Unauthenticated users attempting to access these routes directly are routed to login/relogin.
3. **Modal/Non-Blocking Features:**
* **Import:** Operates via a Modal state on the dashboard (with a global background SSE progress notification bar).
* **Ask AI:** Executes an external redirect (`window.location.href = SPA_URL`).


4. **Nested Route Layouts:** Use `LandingLayout` as the root wrapper with a shared header and persistent SSE progress bar.

---

## 2. Updated Route Enum

Update `router.enum.ts` to include the Export route:

```typescript
// router.enum.ts
export const ROUTE = {
    ROOT: '/',
    QUESTIONS: '/questions',
    CREATE_QUESTION: '/questions/create',
    PROJECTS: '/projects',
    EXPORT: '/export',
    ADMIN: '/admin',
    ERROR: '/error',
    ERROR_CODE: '/error/:code',
    RE_LOGIN: '/relogin',
} as const;

export type Route = (typeof ROUTE)[keyof typeof ROUTE];

```

---

## 3. Router Configuration (`router.tsx`)

Here is the updated router setup separating public routes, protected feature routes, and error fallbacks:

```tsx
// router.tsx
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import { ROUTE } from './router.enum';
import { ErrorPage } from '../error';
import { BaseNetworkError } from '../error/network';
import { LandingLayout } from '../landing/landing-layout';
import { ReLogin } from '../error/relogin';
import { PublicLayout } from '../landing/public-layout';
import { Question } from '../question';
import { QuestionCreate } from '../question/question-create';
import { Project } from '../project';
import { ExportPage } from '../export';
import { Dashboard } from '../dashboard';
import { useAuth } from '../hooks/use-auth';
import { isNull } from '../services/utils.service';
import { ErrorBoundary } from 'react-error-boundary';
import Fallback from '../error/fallback';
import type { ErrorInfo } from 'react';

// Guard component for protected routes
const ProtectedRoute = () => {
    const auth = useAuth();
    if (isNull(auth?.userProfile)) {
        return <Navigate to={ROUTE.RE_LOGIN} replace />;
    }
    return <Outlet />;
};

export const Routes = () => {
    const router = createBrowserRouter(
        [
            {
                path: ROUTE.ROOT,
                element: <LandingLayout />,
                errorElement: <ErrorPage />,
                children: [
                    // Publicly accessible dashboard (renders public vs. auth content conditionally inside)
                    { index: true, element: <Dashboard /> },

                    // Protected routes wrapped in ProtectedRoute
                    {
                        element: <ProtectedRoute />,
                        children: [
                            { path: ROUTE.QUESTIONS, element: <Question /> },
                            { path: ROUTE.CREATE_QUESTION, element: <QuestionCreate /> },
                            { path: ROUTE.PROJECTS, element: <Project /> },
                            { path: ROUTE.EXPORT, element: <ExportPage /> },
                        ],
                    },
                ],
            },
            {
                path: ROUTE.RE_LOGIN,
                element: <PublicLayout />,
                errorElement: <ErrorPage />,
                children: [{ index: true, element: <ReLogin /> }],
            },
            {
                path: ROUTE.ERROR,
                element: <PublicLayout />,
                errorElement: <ErrorPage />,
                children: [
                    { index: true, element: <BaseNetworkError /> },
                    { path: ROUTE.ERROR_CODE, element: <BaseNetworkError /> },
                ],
            },
        ],
        {
            basename: '/dashboard-page',
            future: {
                v7_relativeSplatPath: true,
            },
        }
    );

    return (
        <ErrorBoundary
            FallbackComponent={Fallback}
            onReset={() => {}}
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

function logErrorToService(error: Error, info: ErrorInfo) {
    console.error('Caught an error:', error, info);
}

```

---

## 4. Main Layout (`landing-layout.tsx`)

The root `LandingLayout` manages both logged-in and public visitors, rendering the dynamic `Header`, an optional SSE status notification toast/bar, and the page outlet.

```tsx
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

```

---

## 5. Unified Dashboard Component (`dashboard/index.tsx`)

This component renders the wireframe structures you provided for both non-authenticated and authenticated states, including:

* **Search bar**
* **Action Toolbar** (Ask AI, Import, Export, New Question)
* **Metrics Cards** (Projects, Questions, KB)
* **My Projects List** (Authenticated only)
* **Recently Added Questions**
* **Import Modal with Single-file CSV/Excel validation & SSE notification**

```tsx
// dashboard/index.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, Button, Card, Modal, Upload, message, Notification } from 'antd';
import {
    SearchOutlined,
    RobotOutlined,
    UploadOutlined,
    DownloadOutlined,
    PlusOutlined,
    FileExcelOutlined,
} from '@ant-design/icons';
import { useAuth } from '../hooks/use-auth';
import { isNull } from '../services/utils.service';
import { ROUTE } from '../router/router.enum';
import type { UploadFile } from 'antd/es/upload/interface';

export const Dashboard: React.FC = () => {
    const auth = useAuth();
    const navigate = useNavigate();
    const isAuthenticated = !isNull(auth?.userProfile);

    // Import Modal & SSE State
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [isUploading, setIsUploading] = useState(false);

    // AI External SPA Redirect
    const handleAskAI = () => {
        window.location.href = 'https://ai.internal.company.com'; // External SPA link
    };

    // File Import Logic
    const handleImportSubmit = () => {
        if (fileList.length === 0) {
            message.error('Please select a file to import.');
            return;
        }

        setIsUploading(true);
        setIsImportModalOpen(false);

        // Initiate SSE listener for non-blocking upload progress
        const file = fileList[0];
        const eventSource = new EventSource(`/api/import/progress?fileName=${encodeURIComponent(file.name)}`);

        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.status === 'COMPLETED') {
                Modal.success({
                    title: 'Import Completed',
                    content: `File "${file.name}" has been successfully imported.`,
                });
                eventSource.close();
                setIsUploading(false);
                setFileList([]);
            }
        };

        eventSource.onerror = () => {
            message.error('Error occurred during import processing.');
            eventSource.close();
            setIsUploading(false);
        };
    };

    return (
        <div className="dashboard-container" style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
            {/* Header Section */}
            <div style={{ marginBottom: '24px' }}>
                <h2>Knowledge Dashboard</h2>
                <p style={{ color: '#666' }}>Find, review and manage internal technical knowledge</p>
            </div>

            {/* Search Bar */}
            <div style={{ marginBottom: '24px', display: 'flex', gap: '8px' }}>
                <Input
                    size="large"
                    prefix={<SearchOutlined />}
                    placeholder="Search questions and short answers..."
                />
                {isAuthenticated && <Button type="primary" size="large">Search</Button>}
            </div>

            {/* Actions Toolbar - Authenticated Only */}
            {isAuthenticated && (
                <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                    <Button icon={<RobotOutlined />} onClick={handleAskAI}>Ask AI</Button>
                    <Button icon={<UploadOutlined />} onClick={() => setIsImportModalOpen(true)}>Import</Button>
                    <Button icon={<DownloadOutlined />} onClick={() => navigate(ROUTE.EXPORT)}>Export</Button>
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate(ROUTE.CREATE_QUESTION)}>
                        New Question
                    </Button>
                </div>
            )}

            {/* Metric Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
                <Card title={isAuthenticated ? "My Projects" : "Projects"}>
                    <span style={{ fontSize: '28px', fontWeight: 'bold' }}>4</span>
                </Card>
                <Card title={isAuthenticated ? "My Questions" : "Questions"}>
                    <span style={{ fontSize: '28px', fontWeight: 'bold' }}>37</span>
                </Card>
                <Card title="Knowledge Base">
                    <span style={{ fontSize: '28px', fontWeight: 'bold' }}>248</span>
                </Card>
            </div>

            {/* My Projects Section - Authenticated Only */}
            {isAuthenticated && (
                <div style={{ marginBottom: '32px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <h3>My Projects</h3>
                        <Button type="link" onClick={() => navigate(ROUTE.PROJECTS)}>View all</Button>
                    </div>
                    <Card>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Java Training</span>
                                <span style={{ color: '#888' }}>24 questions</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Spring Boot</span>
                                <span style={{ color: '#888' }}>31 questions</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Architecture</span>
                                <span style={{ color: '#888' }}>18 questions</span>
                            </div>
                        </div>
                    </Card>
                </div>
            )}

            {/* Recently Added Questions Section */}
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <h3>Recently Added Questions</h3>
                    {isAuthenticated && (
                        <Button type="link" onClick={() => navigate(ROUTE.QUESTIONS)}>View all</Button>
                    )}
                </div>
                <Card>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                            <h4>What is a Java Record?</h4>
                            <p style={{ color: '#888', fontSize: '12px', margin: '4px 0' }}>Java • A2 • Updated today</p>
                            <p style={{ color: '#444' }}>"A record is a compact syntax for declaring..."</p>
                        </div>
                        <hr style={{ border: 'none', borderTop: '1px solid #eee' }} />
                        <div>
                            <h4>Explain OAuth2 Authorization Code Flow</h4>
                            <p style={{ color: '#888', fontSize: '12px', margin: '4px 0' }}>Security • A3 • Updated yesterday</p>
                            <p style={{ color: '#444' }}>"Authorization Code Flow allows..."</p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Single File CSV/Excel Import Modal */}
            <Modal
                title="Import Questions"
                open={isImportModalOpen}
                onOk={handleImportSubmit}
                onCancel={() => setIsImportModalOpen(false)}
                confirmLoading={isUploading}
            >
                <Upload
                    maxCount={1}
                    accept=".csv, .xlsx, .xls"
                    beforeUpload={(file) => {
                        const isValidFormat =
                            file.type === 'text/csv' ||
                            file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
                            file.type === 'application/vnd.ms-excel';
                        if (!isValidFormat) {
                            message.error('Only CSV and Excel files are supported!');
                        }
                        return isValidFormat || Upload.LIST_IGNORE;
                    }}
                    fileList={fileList}
                    onChange={({ fileList }) => setFileList(fileList)}
                >
                    <Button icon={<FileExcelOutlined />}>Select File (CSV or Excel)</Button>
                </Upload>
            </Modal>
        </div>
    );
};

```

---

## 6. Create Question Page with Validation (`question/question-create.tsx`)

This layout handles question creation and strictly enforces the business validation requirement: **either `resourceUrl` OR `description` must not be empty**.

```tsx
// question/question-create.tsx
import React from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { ROUTE } from '../router/router.enum';

interface QuestionFormValues {
    question: string;
    shortAnswer: string;
    resourceUrl?: string;
    description?: string;
}

export const QuestionCreate: React.FC = () => {
    const [form] = Form.useForm<QuestionFormValues>();
    const navigate = useNavigate();

    const handleSubmit = (values: QuestionFormValues) => {
        // Business Validation: Ensure at least resourceUrl OR description is populated
        if (!values.resourceUrl?.trim() && !values.description?.trim()) {
            message.error('Either Resource URL or Description must be provided.');
            return;
        }

        // Send create request to backend API...
        message.success('Question created successfully!');
        navigate(ROUTE.QUESTIONS);
    };

    return (
        <div style={{ maxWidth: '800px', margin: '24px auto' }}>
            <Card title="Create New Question">
                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                    <Form.Item
                        name="question"
                        label="Question"
                        rules={[{ required: true, message: 'Question is required' }]}
                    >
                        <Input placeholder="e.g. What is a Java Record?" />
                    </Form.Item>

                    <Form.Item
                        name="shortAnswer"
                        label="Short Answer"
                        rules={[{ required: true, message: 'Short answer is required' }]}
                    >
                        <Input.TextArea rows={2} placeholder="Provide a quick summary..." />
                    </Form.Item>

                    <Form.Item name="resourceUrl" label="Resource URL">
                        <Input placeholder="https://..." />
                    </Form.Item>

                    <Form.Item name="description" label="Description">
                        <Input.TextArea rows={4} placeholder="Detailed explanation or resource notes..." />
                    </Form.Item>

                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                        <Button onClick={() => navigate(ROUTE.ROOT)}>Cancel</Button>
                        <Button type="primary" htmlType="submit">Submit</Button>
                    </div>
                </Form>
            </Card>
        </div>
    );
};

```

---

## 7. Export Component with SSE (`export/index.tsx`)

The export route presents a dedicated layout that triggers non-blocking SSE streaming generation:

```tsx
// export/index.tsx
import React, { useState } from 'react';
import { Card, Select, Radio, Button, Modal, message } from 'antd';

export const ExportPage: React.FC = () => {
    const [format, setFormat] = useState<'csv' | 'excel'>('csv');
    const [selectedProject, setSelectedProject] = useState<string | null>(null);
    const [isExporting, setIsExporting] = useState(false);

    const handleExport = () => {
        setIsExporting(true);

        const eventSource = new EventSource(`/api/export/process?format=${format}&project=${selectedProject || ''}`);

        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.status === 'COMPLETED') {
                Modal.success({
                    title: 'Export Completes',
                    content: 'Your export file is ready for download.',
                });
                eventSource.close();
                setIsExporting(false);
            }
        };

        eventSource.onerror = () => {
            message.error('Export failed to process.');
            eventSource.close();
            setIsExporting(false);
        };
    };

    return (
        <div style={{ maxWidth: '800px', margin: '24px auto' }}>
            <Card title="Export Knowledge Base">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                            Select or Find project to export
                        </label>
                        <Select
                            style={{ width: '100%' }}
                            placeholder="All Projects or select specific..."
                            allowClear
                            onChange={(value) => setSelectedProject(value)}
                            options={[
                                { value: 'java', label: 'Java Training' },
                                { value: 'spring', label: 'Spring Boot' },
                                { value: 'arch', label: 'Architecture' },
                            ]}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Format</label>
                        <Radio.Group value={format} onChange={(e) => setFormat(e.target.value)}>
                            <Radio value="csv">CSV</Radio>
                            <Radio value="excel">Excel (.xlsx)</Radio>
                        </Radio.Group>
                    </div>

                    <Button type="primary" loading={isExporting} onClick={handleExport}>
                        Start Export
                    </Button>
                </div>
            </Card>
        </div>
    );
};

```

---

## Key Takeaways

* Router paths are now organized cleanly under the unified `/` root landing layout.
* Non-authenticated visitors can view the public Landing Dashboard layout freely without hitting automatic redirects.
* Features like **New Question**, **All Projects**, **All Questions**, and **Export** are placed behind `ProtectedRoute` guards and standard SPA navigation.
* File import and export workflows utilize non-blocking Server-Sent Events (SSE) and strict single-file CSV/XLSX type restrictions.

This error happens because the `<Header/>` component definition (located in `../components/header/index.tsx` or similar) is not typed to accept props—it takes `props: {}` by default.

To fix this, update your `<Header/>` component definition to define and accept a `HeaderProps` interface.

---

### Fix in `../components/header/index.tsx` (or `header-index.tsx`)

Update your Header component to receive `isAuthenticated` and `user` as props:

```tsx
import React from 'react';
import { Button } from 'antd';
import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { UserProfile } from '../../auth/auth.interface'; // Adjust path to your User interface/type
import './header.scss';

// 1. Define the props interface
export interface HeaderProps {
    isAuthenticated: boolean;
    user?: UserProfile | null;
}

// 2. Pass HeaderProps to the component
export const Header: React.FC<HeaderProps> = ({ isAuthenticated, user }) => {
    const handleLogout = () => {
        // TODO: integrate with SSO logout
    };

    const handleLogin = () => {
        // TODO: integrate with SSO login / redirect
    };

    return (
        <header className="app-header">
            <div className="app-header__brand">
                <span className="app-header__title">
                    TI Knowledge Platform
                </span>
            </div>

            <div className="app-header__actions">
                {isAuthenticated ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span>
                            <UserOutlined /> {user?.name || user?.username || 'User'}
                        </span>
                        <Button
                            type="text"
                            icon={<LogoutOutlined />}
                            onClick={handleLogout}
                        >
                            Logout
                        </Button>
                    </div>
                ) : (
                    <Button type="primary" onClick={handleLogin}>
                        Sign in
                    </Button>
                )}
            </div>
        </header>
    );
};

```

---

### What Changed?

1. Added `HeaderProps` specifying `isAuthenticated: boolean` and optional `user`.
2. Typed the `Header` component as `React.FC<HeaderProps>` (or function signature `({ isAuthenticated, user }: HeaderProps)`).
3. Conditionality added inside the `<Header/>` template so it renders `Sign in` when `isAuthenticated` is `false` and the user profile dropdown/logout when `true`.

---

For the error SCSS

```scss
.error-page {
min-height: 100vh;
display: flex;
flex-direction: column;
}

.not-found {
flex: 1;
position: relative;
}

.not-found-img {
width: 280px;
max-width: 80%;
height: auto;
}

```

- min-height: 100vh is slightly safer than height: calc(100vh).
- flex: 1 allows the error content to occupy the available space between Header and Footer.
- max-width: 80% prevents the illustration from overflowing on small screens.
- height: auto preserves the PNG aspect ratio.
- position: relative on .not-found is fine, although it isn't currently required by the JSX.

---
When the backend is down and a redirect to `http://localhost:8080/logout` happens, it usually means your OAuth2 / OIDC client library (or an Axios interceptor) is catching a network failure, assuming the user's session expired, and automatically executing a full-page browser redirect (`window.location.href = ...`).

Because it is a hard browser redirect to an unavailable server, React is completely bypassed and cannot show your UI error page.

---

### Step 1: Catch Network Errors in Axios Interceptor

To prevent auto-redirects when the backend is offline (e.g., `ERR_NETWORK` or `status === 0`), update your Axios response interceptor (`src/services/axios.config.ts`) to intercept network failures first and direct users to your `/error` page:

```typescript
// src/services/axios.config.ts
import axios, { AxiosError } from 'axios';
import { ROUTE } from '../router/router.enum';

export const setupInterceptors = (navRef: React.MutableRefObject<any>, apiNotification: any) => {
  axios.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      // 1. Check if backend is completely unavailable (Network Error / CORS fail / Refused connection)
      if (error.code === 'ERR_NETWORK' || !error.response) {
        console.error('Backend server is unreachable:', error);
        
        // Show an immediate notification
        apiNotification.error({
          message: 'Server Unreachable',
          description: 'Unable to connect to the server. Please check your network or try again later.',
        });

        // Redirect safely within React Router rather than triggering a full-page logout redirect
        if (navRef.current) {
          navRef.current(ROUTE.ERROR);
        }
        return Promise.reject(error);
      }

      // 2. Handle HTTP 401 Unauthorized (Only redirect to login/logout if the server actually responded with 401)
      if (error.response?.status === 401) {
        if (navRef.current) {
          navRef.current(ROUTE.RE_LOGIN);
        }
        return Promise.reject(error);
      }

      return Promise.reject(error);
    }
  );
};

```

---

### Step 2: Prevent Unhandled Rejections in `auth.onLogin()`

If your `AuthContext` triggers a redirect (like Keycloak / OAuth2 `login()` or `logout()`), ensure you check backend health or wrap the authorization call so it fails gracefully:

```tsx
// Inside DropdownUser (components/user/index.tsx)
const handleLoginClick = async () => {
    if (isNull(auth)) return;

    setIsLoading(true);
    try {
        await auth.onLogin();
    } catch (error: any) {
        console.error('Login failed due to backend availability:', error);
        
        // Redirect to your dedicated network error page
        navigate(ROUTE.ERROR);
    } finally {
        setIsLoading(false);
    }
};

```

---

### Step 3: Enhance Your `BaseNetworkError` Page (`/error`)

Ensure your `BaseNetworkError` component displays a clear "Server Unreachable" message with a "Retry" button:

```tsx
// src/error/network.tsx
import React from 'react';
import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';
import { ROUTE } from '../router/router.enum';

export const BaseNetworkError: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div style={{ padding: '48px 0' }}>
            <Result
                status="500"
                title="Service Unavailable"
                subTitle="Sorry, the server is currently unreachable. Please check your network connection or try again later."
                extra={
                    <Button type="primary" onClick={() => navigate(ROUTE.ROOT)}>
                        Try Again
                    </Button>
                }
            />
        </div>
    );
};

```

### Key Takeaway

Checking `!error.response` or `error.code === 'ERR_NETWORK'` inside your Axios interceptor stops the app from triggering a hard browser navigation to `localhost:8080/logout` when the backend is offline, keeping the user safely inside your React application where a helpful error screen can be rendered.

---
What Was Fixed

    Network Failures No Longer Trigger Relogin:
    Previously, error.code === 'ERR_NETWORK' caused navRef.current(ROUTE.RE_LOGIN). If the backend was down, hitting /relogin tried to perform an auth check against an offline backend, causing the app to crash or redirect to http://localhost:8080/logout. Now, it notifies the user and routes them to ROUTE.ERROR.

    Safe Optional Chaining (?.):
    error.response.data.errorMessage previously crashed with a JavaScript TypeError if error.response or error.response.data was undefined. Using error.response?.data?.errorMessage avoids this runtime crash.

    Cleaner Error Routing:
    Replaced ' /page/error' + '/' + error.code with your defined router enum (${ROUTE.ERROR}/${errorCode}).

