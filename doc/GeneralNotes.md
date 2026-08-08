# Technical stack

### React
│
├── Vite              → development server + production build
├── ESLint            → code-quality / bug detection
├── Prettier          → code formatting
├── Vitest            → unit/component tests
├── React Hooks       → local state
├── Context API       → shared state when necessary
└── React Router v7   → SPA navigation

### Vite

Vite has two main responsibilities:

During development:
`Browser → Vite Dev Server → React application`

It provides a very fast development server and HMR.

For production:

`React source
     ↓
    Vite
     ↓
optimized static files
     ↓
Nginx
`

This fits your planned Docker architecture very well:

`Browser
   ↓
Nginx
   ↓
React SPA`

### NPM

NPM is your package manager.

For example:
```bash
npm install react-router-dom
npm install -D vitest
```
It manages:

dependencies
dependency versions
package.json
package-lock.json
project scripts

For project, package-lock.json should normally be committed to Git so that CI/CD installs reproducible dependency versions.

### IntelliJ IDEA + ESLint + Prettier

Think of them as having different responsibilities:

| Tool          | Responsibility                         |
| ------------- | -------------------------------------- |
| IntelliJ IDEA | IDE                                    |
| ESLint        | "Is this code potentially wrong/bad?"  |
| Prettier      | "Is this code formatted consistently?" |

Important: ESLint and Prettier are complementary, not competing tools.

### Vitest

The main advantage is that Vitest is designed around the Vite ecosystem, so configuration and module handling are very natural.

Typical test:
```javascript
import { describe, expect, it } from 'vitest';

describe('calculateTotal', () => {
    it('should calculate total', () => {
        expect(2 + 3).toBe(5);
    });
});
```

### ESLint

ESLint is more than formatting.

It helps identify:

- unused variables/imports
- suspicious code
- incorrect React Hooks usage
- missing dependencies in Hooks
- common JavaScript mistakes
- violations of your project's coding rule

### Prettier

Prettier should have a very simple responsibility:

Automatically make the source code consistently formatted.

### useState / useReducer
Start with:

useState

for simple state:

const [searchText, setSearchText] = useState('');

Use:

useReducer

when the state becomes more complex, for example a multi-step import form.

### React Context API

Context is useful for genuinely global/shared concerns.

For your TI platform, good candidates could eventually be:

```text
AuthContext
UserContext
ApplicationContext
```

For example:
```text
User
 ├── name
 ├── roles
 └── permissions
```

!!! would not put all application state into Context. Context is primarily for sharing values; it isn't automatically a replacement for every kind of state-management architecture.

### React Router v7

This is the right choice for your SPA.

Your application could eventually have routes such as:

```text
/login
/dashboard
/projects
/questions
/questions/:id
/import
/export
/search
```

Conceptually:

```text
Browser
   │
   ├── /dashboard
   ├── /projects
   ├── /questions
   ├── /questions/123
   ├── /import
   └── /search
          │
          ▼
       React Router
          │
          ▼
    React component
```

Frontend architecture:

```text
ti-ui
│
├── pages/          ← Dashboard, Questions, Import, Export...
├── components/     ← reusable UI components
├── layouts/        ← application layouts
├── hooks/           ← custom React hooks
├── context/         ← global application context
├── services/        ← calls to ti-gateway-api
├── api/             ← API definitions/clients
├── types/           ← shared frontend types
├── utils/           ← small utilities
└── assets/
```

### SVG

favicon.svg — optimized for the browser tab.

icon.svg — larger version for use inside the React application.



