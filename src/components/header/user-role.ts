import { getRoles } from '../../services/api.service';

export const getRolesAsync = async() => {
    const response = await getRoles();
    return response.data;
};