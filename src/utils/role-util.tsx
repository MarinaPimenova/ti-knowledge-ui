import {type Role, ROLE} from '../auth/roles.enum';

export const isUser = (role: Role | undefined) => {
    if (role === ROLE.USER) return true;
    return false;
};

export const isSystem = (role: Role | undefined) => {
    if (role === ROLE.SYSTEM) return true;
    return false;
};

export const isAdmin = (role: Role) => {
    if (role === ROLE.ADMIN) return true;
    return false;
};