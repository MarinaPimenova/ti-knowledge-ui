import type { Role } from './roles.enum';

export interface User {
    email: string | null;
    given_name: string | null;
    family_name: string | null;
    roles: Role[] | null;
    username: string;
    registered: boolean;
}

export interface Error0 {
    message: string | null;
}

export interface AuthContextType {
    userProfile: User | undefined;
    onLogin: () => void;
    onLogout: (callback: VoidFunction) => void;
    isLoading?: boolean;
}