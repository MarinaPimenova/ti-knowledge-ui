export const ROLE = {
    USER: 'user',
    ADMIN: 'admin',
    SYSTEM: 'system',
} as const;

export type Role = typeof ROLE[keyof typeof ROLE];