Here is a comprehensive analysis and breakdown of the step-by-step execution flow 

between React application components, 
state handlers, 
utilities, 
and backend services for each of the specified scenarios.

---

## Architecture Overview & Bootstrap Sequence

```
           [ main.tsx ]
                 │
                 ▼
            [ App.tsx ]
                 │
                 ▼
        [ AuthProvider.tsx ] ── (React Context: AuthContext)
                 │
                 ▼
        [ Router.tsx (RouterProvider) ]
                 │
                 ▼
        [ LandingLayout.tsx ] ──► Initializes <Interceptor />
                                       │
                                       ▼
                       setupInterceptors(navRef, api)
                       Registers Axios Interceptors (landingPageApi & restApi)

```

1. **`main.tsx`** renders **`App.tsx`**.
2. **`App.tsx`** wraps the app with `<AuthProvider>` and mounts `<Routes/>`.
3. **`AuthProvider.tsx`** manages the `userProfile` state in `AuthContext` and exposes `onLogin` and `onLogout`.
4. **`router.tsx`** instantiates `createBrowserRouter` with basename `/dashboard-page`.
5. **`LandingLayout.tsx`** mounts the `<Interceptor/>` component.
6. **`<Interceptor/>`** invokes `setupInterceptors(navRef, api)`, binding Axios response handling (handling 401/403/`ERR_NETWORK` errors) to React Router and Ant Design notifications.

---

## Detailed Scenario Analysis

### Scenario 1 — Direct Access Through Gateway (`http://localhost:8080`)

```
Browser               Gateway (Spring Security)                      Okta Identity               React App (:3000)
   │                             │                                        │                             │
   │─── GET / ──────────────────►│                                        │                             │
   │                             ├─ Not Authenticated                     │                             │
   │◄── 302 Redirect / Login ────┤                                        │                             │
   │                             │                                        │                             │
   │─── GET /oauth2/...okta ────►│                                        │                             │
   │                             ├─ Initiate OAuth Code Flow ────────────►│                             │
   │◄────────────────────────────┴────────────────────────────────────────┤ (User Logs In)              │
   │                                                                      │                             │
   │─── GET /login/oauth2/code/okta ─────────────────────────────────────►│                             │
   │                             ├── Validates Authorization Code         │                             │
   │                             ├── Creates HTTP Session & Set-Cookie    │                             │
   │◄── 302 /dashboard-page ─────┤                                        │                             │
   │                             │                                        │                             │
   │─────────────────────────────┼────────────────────────────────────────┼────────────────────────────►│
   │                             │                                        │   Loads SPA & checks auth   │

```

1. **Initial Entry:** The browser accesses `http://localhost:8080`.
2. **Authentication Guard:** Spring Security detects an unauthenticated session and returns a `302 Redirect` to the login prompt.
3. **SSO Authorization:** Navigating to `/oauth2/authorization/okta` redirects the browser to the Okta authentication page.
4. **Callback Processing:** Upon successful login, Okta redirects back to `/login/oauth2/code/okta`. Spring Security:
* Validates the authorization code and exchanges it for tokens.
* Establishes an HTTP session and sends back an `HttpOnly` session cookie (`JSESSIONID`).
* Issues a `302 Redirect` to `http://localhost:3000/dashboard-page`.


5. **Failure Case:** If login fails, the Gateway intercepts the error and returns a structured `401 Unauthorized` JSON payload rather than unhandled exception pages.

---

### Scenario 2 — Direct SPA Access With Backend Down

```
Browser              React SPA (:3000)                DropdownUser               restApi (Axios)               Backend (:8080)
   │                         │                             │                            │                             │
   │── Open /dashboard-page ►│                             │                            │                             │
   │                         ├── Render Simple Dashboard   │                            │                             │
   │                         └── Render Header/Dropdown ──►│                            │                             │
   │                                                       ├── User clicks "Login"      │                             │
   │                                                       ├── checkBackendHealth() ───►│                             │
   │                                                       │                            ├── GET /api/v1/user ────────►│ (DOWN / Connection
   │                                                       │                            │◄── ERR_NETWORK / Refused ───┤  Refused)
   │                                                       │◄── Catch network error ────┤                             │
   │                                                       ├── isBackendAlive = false   │                             │
   │                                                       ├── setNetworkError(true)    │                             │
   │                         ◄─────────────────────────────┴── (Zustand updated)        │                             │
   │                         │                                                          │                             │
   ├── Render Alert Banner ──┤                                                          │                             │
   │   "Network Error:       │                                                          │                             │
   │    Backend service..."  │                                                          │                             │

```

1. **Initial Load:** The user directly opens `http://localhost:3000/dashboard-page`. The application renders the `LandingLayout` containing the public header and `Dashboard`.
2. **Triggering Health Check:** When the user clicks **Login**, `DropdownUser` sets its state to `isLoading = true` and invokes `checkBackendHealth()`:
```typescript
await restApi.get('/api/v1/user', { timeout: 3000 });

```


3. **Handling Connection Failure:**
* The request fails with `ERR_NETWORK` (or connection refused).
* `checkBackendHealth()` catches the error and returns `false`.


4. **Updating Global Error State:**
* `DropdownUser` calls `setNetworkError(true)` on `useNetworkStore`.
* `isLoading` is set back to `false`, re-enabling the Login button.


5. **UI Rendering:** `<Header/>` observes `hasNetworkError === true` from `useNetworkStore` and renders an Ant Design `<Alert>` banner across the top of the viewport.

---

### Scenario 3 — Direct SPA Access by Unauthenticated User

```
Browser                 React SPA                 AuthContext               ssoAuthProvider               Backend (:8080)
   │                         │                         │                           │                             │
   │── Open /dashboard-page ►│                         │                           │                             │
   │                         ├── Mount Dashboard       │                           │                             │
   │                         ├── Check auth state ────►│                           │                             │
   │                         │                         ├── userProfile === undefined                       │
   │                         │◄────────────────────────┴                           │                             │
   │                         │                                                     │                             │
   │                         ├── Render Public Simple Dashboard                    │                             │
   │                         │   ├── Search bar (public view)                      │                             │
   │                         │   ├── Public Metrics (4, 37, 248)                   │                             │
   │                         │   └── Hidden: "Ask AI", "Import", "Export"          │                             │
   │                         │                                                     │                             │
   │                         └── Render Header ──► DropdownUser                    │                             │
   │                                                └── Render [ Login ] Button    │                             │

```

1. **Mounting:** The user opens `http://localhost:3000/dashboard-page`.
2. **Context Evaluation:** `Dashboard` calls `useAuth()`. Because no user is logged in, `auth.userProfile` is `undefined`.
3. **UI Conditioning:**
* **`Dashboard.tsx`**: Evaluates `isAuthenticated = false`. It renders public search, metrics cards, and recently added questions, while hiding restricted features like *Ask AI*, *Import*, *Export*, and *My Projects*.
* **`DropdownUser.tsx`**: Evaluates `isAuth = false` and renders the public **Login** button.


4. **Route Guard Enforcement:** If the user manually tries to navigate to a protected URL like `/dashboard-page/questions`, `ProtectedRoute` inside `router.tsx` executes:
```typescript
if (isNull(auth?.userProfile)) return <Navigate to={ROUTE.RE_LOGIN} replace />;

```


This redirects the user to the `/relogin` view.

---

### Scenario 4 — Login From the Simple Dashboard

```
DropdownUser                     useNetworkStore            checkBackendHealth()          auth.onLogin()             sso-auth.ts
     │                                  │                            │                          │                         │
     ├── User clicks [ Login ]          │                            │                          │                         │
     ├── setIsLoading(true)             │                            │                          │                         │
     ├── setNetworkError(false) ───────►│                            │                          │                         │
     │                                  │                            │                          │                         │
     ├── checkBackendHealth() ──────────────────────────────────────►│                          │                         │
     │                                                               ├── GET /api/v1/user      │                         │
     │◄── Returns true (401 or 200) ─────────────────────────────────┴                          │                         │
     │                                                                                          │                         │
     ├── auth.onLogin() ───────────────────────────────────────────────────────────────────────►│                         │
     │                                                                                          ├── ssoAuthProvider.      │
     │                                                                                          │   getUserProfile(...) ─►│
     │                                                                                          │                         ├── login()
     │                                                                                          │                         └── window.location.href = 
     │                                                                                          │                             "/oauth2/authorization/okta"

```

1. **User Action:** The user clicks the **Login** button on the public dashboard header.
2. **UI Loading State:**
* `setIsLoading(true)` disables the button and updates the text to **"Connecting..."**.
* `setNetworkError(false)` clears any existing network banner.


3. **Pre-flight Health Ping:** `checkBackendHealth()` calls `restApi.get('/api/v1/user')`.
* The backend responds with `401 Unauthorized` (indicating the backend is alive, but the user is unauthenticated).
* `checkBackendHealth()` returns `true`.


4. **Executing SSO Redirect:** `DropdownUser` calls `auth.onLogin()`:
* `onLogin()` triggers `ssoAuthProvider.getUserProfile()`.
* `getUserProfile()` catches the `401` status from the backend and calls `login()` in `sso-auth.ts`:
```typescript
window.location.href = apiServerUrl + '/oauth2/authorization/okta?redirectId=knowledge-url';

```




5. **Gateway Authorization Handshake:**
* The browser navigates away from React to the Gateway (`:8080/oauth2/authorization/okta`).
* The Gateway conducts the OAuth2 authentication flow with Okta.
* Okta redirects back to `:8080/login/oauth2/code/okta`.
* The Gateway creates the session and redirects the browser back to `:3000/dashboard-page`.



---

### Scenario 5 — Authenticated Dashboard Flow

```
Browser               React SPA                   Axios / restApi                   Gateway / Backend
   │                      │                              │                                  │
   │── GET /dashboard ───►│                              │                                  │
   │                      ├── AuthProvider initializes   │                                  │
   │                      ├── getUserProfile() ─────────►│                                  │
   │                      │                              ├── GET /api/v1/user               │
   │                      │                              │   (Cookie sent automatically) ──►│
   │                      │                              │◄── 200 OK + User JSON Payload ──┤
   │                      │◄── Returns user data ────────┤                                  │
   │                      │                                                                 │
   │                      ├── setUserProfile(user)                                          │
   │                      │                                                                 │
   │                      ├── Dashboard renders with `isAuthenticated = true`               │
   │                      │   ├── Show "Ask AI", "Import", "Export", "New Question"         │
   │                      │   └── Show "My Projects" Section                                │
   │                      │                                                                 │
   │                      └── DropdownUser renders user profile name dropdown               │

```

1. **Session Cookie Propagation:** The browser stores the `JSESSIONID` cookie returned by the Gateway (`withCredentials: true`). No tokens are stored in `localStorage` or `sessionStorage`.
2. **Context Population:**
* When the React app boots up, `ssoAuthProvider.getUserProfile()` issues a `GET /api/v1/user` request using Axios.
* The Gateway receives the request with the session cookie, validates the session, and returns the user details (`email`, `username`, `roles`, etc.).
* `AuthProvider` calls `setUserProfile(authenticatedUser)`, storing the user in React Context.


3. **UI Expansion:**
* **`Dashboard.tsx`**: Unlocks extended features (*Ask AI*, *Import Modal*, *Export*, *New Question*, and *My Projects*).
* **`DropdownUser.tsx`**: Replaces the **Login** button with a dropdown displaying the username (via `getUserName(userProfile)`).


4. **Backend API Proxy:** Subsequent API calls issued through `restApi` or `landingPageApi` automatically attach the browser session cookie. The Gateway validates the session and forwards requests to internal microservices with the necessary authorization headers.

---

### Scenario 6 — Logout Flow

```
DropdownUser                 auth.onLogout()               sso-auth.ts (reset)           Gateway / Backend
     │                              │                              │                                 │
     ├── User selects "Logout"      │                              │                                 │
     ├── handleLogoutClick() ──────►│                              │                                 │
     │                              ├── setUser(undefined)         │                                 │
     │                              ├── callback()                 │                                 │
     │                              │   ├── sessionStorage.clear() │                                 │
     │                              │   └── navigate('/')          │                                 │
     │                              │                              │                                 │
     │                              └── reset() ──────────────────►│                                 │
     │                                                             └── window.location.href =        │
     │                                                                 apiServerUrl + '/logout' ────►│
     │                                                                                               ├── Invalidate session
     │                                                                                               ├── Clear cookie
     │◄── Redirect to /dashboard-page/logout (ReLogin component) ───────────────────────────────────┤

```

1. **Triggering Logout:** The user clicks the user dropdown menu and selects **Logout**.
2. **React Context Teardown:** `handleLogoutClick()` calls `auth.onLogout()`:
```typescript
auth.onLogout(() => {
    sessionStorage.clear();
    navigate(ROUTE.ROOT);
});

```


* `setUser(undefined)` clears `userProfile` from `AuthContext`.
* `sessionStorage` is cleared, and React Router navigates to `ROUTE.ROOT`.


3. **Gateway Session Termination:** `onLogout` executes `reset()` from `sso-auth.ts`:
```typescript
window.location.href = apiServerUrl + '/logout';

```


4. **Invalidation:** The Gateway receives the `/logout` request, invalidates the HTTP session, clears the session cookie on the browser, and redirects the user back to the public logout landing page: `http://localhost:3000/dashboard-page/logout`.
5. **Logout Page Rendering:**
* The router matches `/logout` (or `ROUTE.RE_LOGIN`) and renders the `ReLogin` component inside `PublicLayout`.
* The page displays a logged-out illustration along with a **Log In Again** button.