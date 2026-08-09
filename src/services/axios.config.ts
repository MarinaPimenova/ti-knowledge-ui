import axios from 'axios';
import {type NotificationEnums, NotificationType} from './notifications.enum';
import {ROUTE} from '../router/router.enum';

export const landingPageApi = axios.create({
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});


export const restApi = axios.create({
    headers: {
        'Content-Type': 'application/json',
    },
});

export const openNotificationWithIcon = (api: any, type: NotificationEnums, title: string, desc: string, key: string) => {
    api[type]({
        key,
        message: title,
        description: desc,
    });
};

const requestInterceptor = (config: any) => config;

export const setupInterceptors = (navRef: any, notifyApi: any) => {
    landingPageApi.interceptors.request.use(requestInterceptor);

    restApi.interceptors.request.use(requestInterceptor);
    const apis = [landingPageApi.interceptors, restApi.interceptors];

    apis.forEach((api) => {
        api.response.use(
            (response) => response,
            (error) => {
                if (error) {
                    if (error.response?.status === 401 || error.code === 'ERR_NETWORK' || error.response?.status === 403) {
                        return navRef.current(ROUTE.RE_LOGIN); // this redirection works when a user's session is expired
                    }
                    let desc =
                        'This is the content of the notification. This is the content of the notification. This is the content of the notification.';

                    if (error.response.data && !error.response.data.errorMessage.includes('Invalid pattern value')) {
                        desc = error.response.data.errorMessage;
                        openNotificationWithIcon(notifyApi, NotificationType.error, 'Error Occurred', desc, NotificationType.error);
                    } else {
                        return navRef.current('/page/error' + `/${error.code}`);
                    }
                }
                return Promise.reject(new Error(error));
            },
        );
    });
};