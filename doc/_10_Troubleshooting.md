# Fix brief "Service Unavailable" flash

That brief **"Service Unavailable"** flash happens because of a race condition between your pre-flight health check (`checkBackendHealth()`) and the error interceptor logic.

When the user clicks **Login**, `checkBackendHealth()` fires a request to `/api/v1/user`.

1. Since the user is unauthenticated, the Gateway responds with **401 Unauthorized**.
2. However, because `checkBackendHealth()` did **not** pass `skipAuthRedirect: true`, your Axios Interceptor catches the `401` response.
3. The interceptor immediately executes:
```typescript
navRef.current(ROUTE.RE_LOGIN); // Navigates to /dashboard-page/relogin

```


4. On `/relogin`, the component briefly displays "Service Unavailable" (or the relogin illustration view) for 1 second before `auth.onLogin()` manages to redirect the browser window location to Okta!

---

### The Fix

To fix this, update `checkBackendHealth()` inside `DropdownUser` (`src/components/user/index.tsx`) to pass `skipAuthRedirect: true`.

This allows `checkBackendHealth()` to safely inspect the HTTP response without triggering any side-effect route redirects.

#### Update `src/components/user/index.tsx`

```typescript
const checkBackendHealth = async (): Promise<boolean> => {
    try {
        await restApi.get('/api/v1/user', {
            timeout: 3000,
            skipAuthRedirect: true, // <--- Add this flag!
        } as any);
        return true;
    } catch (error: any) {
        // 401 Unauthorized or 403 Forbidden means Gateway is UP and alive!
        if (error.response?.status === 401 || error.response?.status === 403) {
            return true;
        }
        // Connection Refused / ERR_NETWORK / 5xx Server Errors
        return false;
    }
};

```

---

### What Happens Now

1. The user clicks **Login**.
2. `checkBackendHealth()` pings `/api/v1/user` with `skipAuthRedirect: true`.
3. The Gateway returns **401 Unauthorized**.
4. The Axios interceptor sees `skipAuthRedirect: true` and **does NOT redirect** to `/relogin`.
5. `checkBackendHealth()` catches the 401 error, determines `isBackendAlive = true`, and returns `true`.
6. `DropdownUser` proceeds directly to execute `auth.onLogin()`, seamlessly redirecting the browser straight to:
```text
http://localhost:8080/oauth2/authorization/okta

```


without any UI flicker or brief navigation to the error/relogin page!