# TI Knowledge UI (`ti-knowledge-ui`)

An enterprise React single-page application built with **React 19**, **TypeScript**, **Vite**, and **Ant Design**. It provides structured workflows for managing questions, projects, exports, and interactive AI capabilities with integrated SSO authentication and resilient network failure management.

---

## 🛠️ Tech Stack & Key Technologies

* **Core:** React 19, TypeScript, React Router DOM v7
* **Build Tool:** Vite, `vite-plugin-svgr` (SVG as React components), Sass (`sass-embedded`)
* **UI Components & Icons:** Ant Design (`antd`), `@ant-design/icons`
* **State Management:** Zustand
* **HTTP Client:** Axios (with custom request/response interceptors)
* **Testing & Linting:** Vitest, Testing Library, ESLint

---

## 📋 Features

1. **Authentication & Role Safeguards:**
   - Single Sign-On (SSO / Okta) integration.
   - Guarded routes via `<ProtectedRoute />` preventing unauthorized access to core features.
2. **Resilient Network Handling:**
   - Pre-login health checks to verify backend availability.
   - Global network error alert banners via Zustand store and Axios response interceptors.
   - Automated routing between public, error, and protected layouts.
3. **Core Modules:**
   - **Dashboard:** Operational overview with SSE support and file import capabilities.
   - **Questions:** Creation and management of enterprise knowledge base questions.
   - **Projects:** Workspace creation and tracking.
   - **Export:** Export functionality for structured assets.

---

## 🚀 Getting Started

### Prerequisites

* **Node.js**: `>= 20.0.0`
* **npm**: `>= 10.0.0`

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd ti-knowledge-ui

```

2. **Install dependencies:**
```bash
npm install

```



### Available Scripts

In the project directory, you can run:

* **`npm run dev`**: Starts the local Vite development server.
* **`npm run build`**: Runs TypeScript type-checking (`tsc -b`) and builds the production assets using Vite.
* **`npm run preview`**: Serves the local build output for previewing.
* **`npm run lint`**: Executes ESLint across the codebase.

---

## 🔄 User Behavior & Application Flow

```
                             ┌───────────────────────┐
                             │  User visits Root URL │
                             └──────────┬────────────┘
                                        │
                                        ▼
                            ┌──────────────────────┐
                            │    LandingLayout     │
                            │ (Public Header/View) │
                            └──────────┬────────────┘
                                       │
            ┌──────────────────────────┴──────────────────────────┐
            │                                                     │
            ▼                                                     ▼
   [ User Clicks Login ]                                [ Unauthenticated User ]
            │                                           Accesses Protected Route
            ▼                                                     │
┌──────────────────────┐                                          ▼
│ Backend Health Check │                                ┌───────────────────┐
└──────────┬───────────┘                                │ Redirect to       │
           │                                            │ /relogin          │
 ┌─────────┴─────────┐                                  └───────────────────┘
 │                   │
 ▼ (Offline)         ▼ (Online)
┌─────────────────┐ ┌───────────────────────────┐
│ Trigger Header  │ │ Redirect to Okta / SSO    │
│ Error Banner    │ │ Authenticate User         │
│ Re-enable Button│ └─────────────┬─────────────┘
└─────────────────┘               │
                                  ▼
                     ┌───────────────────────────┐
                     │ Render Authenticated Shell│
                     │ (Header, SideNav, Outlet) │
                     └────────────┬──────────────┘
                                  │
                                  ▼
                     ┌───────────────────────────┐
                     │ Access Protected Modules: │
                     │ - Questions               │
                     │ - Projects                │
                     │ - Export                  │
                     └───────────────────────────┘

```

### Detailed Flow Steps:

1. **Unauthenticated Entry:**
* When users land on the application (`/`), they are presented with the `LandingLayout` and a simplified public header containing the **Login** button.
* If an unauthenticated user attempts to access protected routes (e.g., `/questions`, `/projects`), the `ProtectedRoute` guard automatically redirects them to `/relogin`.


2. **Authentication Flow (Login Click):**
* When the user clicks **Login**, the UI disables the button and enters a loading state to prevent double-submissions.
* Before executing the SSO redirect, a **Backend Health Check** is performed:
* **If Backend is Offline:** The login button re-enables immediately, and a red global **Network Error Banner** drops down from the header informing the user to try again later without breaking the React app shell.
* **If Backend is Online:** The app triggers the SSO OAuth2/Okta authentication workflow.




3. **Authenticated State:**
* Upon successful login, user profiles populate in `AuthContext`.
* The application automatically transitions from `PublicLayout` to the main authenticated app layout (`Header`, main workspace `Container`, `Footer`).
* The **Login** button in the top right transforms into a user profile dropdown displaying the logged-in username with a **Logout** option.


4. **Session Expiration / Network Failures:**
* **401/403 Errors:** Handled by Axios response interceptors to direct users back to `/relogin`.
* **Network Loss (`ERR_NETWORK`):** Intercepted globally to render the `/error` screen or trigger the network banner, preserving SPA navigation instead of hard-failing to an unrendered server page.



---

## 📁 Project Structure

```text
src/
├── assets/             # Static SVGs, imagery, and global styles
├── auth/               # SSO providers, auth contexts, interfaces
├── components/         # Shared UI components (Header, Footer, User Dropdown)
├── error/              # Error boundary components and network error pages
├── hooks/              # Custom React hooks (useAuth, etc.)
├── router/             # Router configuration and enum route definitions
├── services/           # Axios setup, notification helpers, utility methods
├── store/              # Zustand global state stores (e.g., networkStore)
└── main.tsx            # Application entry point

```
