// router.enum.ts
export const ROUTE = {
    ROOT: '/',
    QUESTIONS: '/questions',
    CREATE_QUESTION: '/questions/create',
    PROJECTS: '/projects',
    CREATE_PROJECT: '/projects/create',
    EXPORT: '/export',
    ADMIN: '/admin',
    ERROR: '/error',
    ERROR_CODE: '/error/:code',
    RE_LOGIN: '/relogin',
} as const;

export type Route = (typeof ROUTE)[keyof typeof ROUTE];