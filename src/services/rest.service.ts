import {getServerUrl} from "../auth/sso-auth.ts";
import type {ISupportContactPayload} from "../error/network/notification.interface.ts";
import {restApi} from "./axios.config.ts";

const apiServerUrl = getServerUrl('ORIGINAL');

export const sendEmailToSupport = (payload: ISupportContactPayload) => {
    return restApi.post<string, any>(`${apiServerUrl}\/rest/v1/contact/support`, payload);
}