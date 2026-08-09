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