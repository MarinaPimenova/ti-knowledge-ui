# "Training Internal Knowledge Platform" not authenticated layout / view

```text
┌─────────────────────────────────────────────────────────────────────┐
│ TI Knowledge Platform                              👤 log in ▾      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Knowledge Dashboard                                                │
│  Find, review and manage internal technical knowledge               │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ 🔍 Search questions and short answers...                      │  │
│  │ is available only log in                                      │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                     │
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

# After a user logged in, the user is able to see the following:

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



For the **logged-in** user I see the following flows:<br/>
when user click on:
-Search button -> perform search questions and answers by keywords and redirects user to see results <br/>
to Question page to see list of QuestionRecord.
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
---

## Scenario 1 — Direct Access Through Gateway

The user opens:

```text
http://localhost:8080
```

The Gateway checks the current authentication state.

### Unauthenticated user

The Gateway displays the login page or login entry point.

```text
Browser
   |
   | GET /
   v
Gateway
   |
   | Not authenticated
   v
Login Page
```

The user starts authentication using:

```text
GET /oauth2/authorization/okta
```

The Gateway redirects the browser to the Okta-hosted login page.

```text
Browser
   |
   v
Gateway
   |
   | /oauth2/authorization/okta
   v
Okta
```

After successful authentication, Okta redirects the browser to the Gateway callback:

```text
http://localhost:8080/login/oauth2/code/okta
```

The callback endpoint is handled by Spring Security.

The Gateway:

1. Validates the OAuth2 authorization response.
2. Exchanges the authorization code for tokens.
3. Creates the authenticated SecurityContext.
4. Creates the local HTTP session.
5. Stores the authenticated state in the session.
6. Redirects the browser to:

```text
http://localhost:3000/dashboard-page
```

The React application then displays the authenticated dashboard.

### Login failure

If authentication fails, the Gateway should provide a controlled response.

Possible behavior:

```text
401 Unauthorized
```

The important point is that authentication failures should not result in an unhandled Spring exception or a generic server error page.

---

# Scenario 2 — Direct SPA Access With Backend Down

The user opens:

```text
http://localhost:3000/dashboard-page
```

The SPA initializes and checks:

```text
GET http://localhost:8080/actuator/health
```

If the Gateway is unavailable:

```text
ERR_NETWORK
```

or the health endpoint cannot be reached, the SPA displays:

```text
Something went wrong
Network Issue

Backend service is currently unavailable.
Please try again later.
```

The application should not attempt to render the authenticated dashboard because the authentication state cannot reliably be determined.

---

# Scenario 3 — Direct SPA Access by Unauthenticated User

The user opens:

```text
http://localhost:3000/dashboard-page
```

The SPA performs:

```text
GET http://localhost:8080/actuator/health
```

The Gateway responds:

```json
{
  "status": "UP"
}
```

The SPA then determines the current authentication state.

If the user is not authenticated:

```text
Public Header
       |
       +-- Login

Simple Dashboard
```

The user can browse the public/simple dashboard but cannot access protected functionality.

---

# Scenario 4 — Login From the Simple Dashboard

The user clicks:

```text
Login
```

The button immediately enters a loading state:

```text
[ Loading... ]
```

and becomes disabled to prevent multiple authentication requests.

The browser is redirected to:

```text
http://localhost:8080/oauth2/authorization/okta
```

The Gateway starts the OAuth2 Authorization Code Flow.

```text
React
  |
  | /oauth2/authorization/okta
  v
Gateway
  |
  v
Okta Hosted Login
  |
  | Authentication
  v
Gateway
  |
  | /login/oauth2/code/okta
  |
  | Create local session
  v
React
  |
  v
Extended Dashboard
```

The important distinction is:

```text
/oauth2/authorization/okta
```

is the **login initiation endpoint**.

```text
/login/oauth2/code/okta
```

is the **OAuth2 callback endpoint**.

The React application should normally redirect to the first endpoint and should not directly invoke the callback endpoint.

---

# Scenario 5 — Authenticated Dashboard

After successful authentication, the Gateway maintains the authenticated user through the local session.

The browser communicates with the Gateway using the session cookie.

```text
React SPA
    |
    | HTTP request + session cookie
    v
Gateway
    |
    | authenticated request
    v
Backend APIs
```

The React application does not need to store the OAuth2 access token in:

* `localStorage`
* `sessionStorage`
* React state

This keeps the OAuth2 credentials outside the browser application's JavaScript-accessible storage.

The Gateway can then communicate with protected backend services using the appropriate OAuth2 access token/JWT.

---

# Scenario 6 — Logout

The authenticated user clicks:

```text
Logout
```

The UI sends a logout request to the Gateway.

```text
React
   |
   | Logout
   v
Gateway
   |
   | Invalidate HTTP session
   | Clear authentication
   | Delete session cookie
   v
React
```

The UI then navigates to:

```text
http://localhost:3000/dashboard-page/logout
```

The logout component can display:

```text
You have been logged out.
```

and provide:

```text
Login
```


---
Find below the code:
```javascript - router.tsx

```

```javascript - router.enum.ts

```

```javascript - landing-layout.tsx

```

```javascript - public-layout.tsx

```

So, the current implementation of "landing-layout.tsx" anf router.tsx performs:


and 
```javascript - public-header.tsx

```

and 

```javascript - header-index.tsx

```

---
