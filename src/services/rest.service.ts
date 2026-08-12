import type {ISupportContactPayload} from "../error/network/notification.interface.ts";
import {restApi} from "./axios.config.ts";

export const sendEmailToSupport = (payload: ISupportContactPayload) => {
    return restApi.post<string, any>(`/rest/v1/contact/support`, payload);
}