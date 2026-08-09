import axios, { AxiosError } from 'axios';
import { type NotificationEnums, NotificationType } from './notifications.enum';
import { ROUTE } from '../router/router.enum';
// Inside setupInterceptors in axios.config.ts
import { useNetworkStore } from '../store/network/network.store';

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

export const openNotificationWithIcon = (
    api: any,
    type: NotificationEnums,
    title: string,
    desc: string,
    key: string
) => {
    if (!api || !api[type]) return;
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
            (error: AxiosError<any>) => {
                if (error) {
                    // -------------------------------------------------------------
                    // 1. Backend Service Unavailable / Network Connection Failed
                    // -------------------------------------------------------------
                    if (error.code === 'ERR_NETWORK' || !error.response) {
                        // Set banner state globally
                        useNetworkStore.getState().setNetworkError(true);
/*                        openNotificationWithIcon(
                            notifyApi,
                            NotificationType.error,
                            'Service Unavailable',
                            'Unable to connect to the backend server. Please check your network or try again later.',
                            'network-error'
                        );

                        // Route to dedicated network error page instead of triggering logout/relogin
                        if (navRef.current) {
                            return navRef.current(ROUTE.ERROR);
                        }*/
                        return Promise.reject(error);
                    }

                    // -------------------------------------------------------------
                    // 2. Authentication / Authorization Expiry (401 / 403)
                    // -------------------------------------------------------------
                    if (error.response.status === 401 || error.response.status === 403) {
                        if (navRef.current) {
                            return navRef.current(ROUTE.RE_LOGIN);
                        }
                        return Promise.reject(error);
                    }

                    // -------------------------------------------------------------
                    // 3. Other API Errors (400, 500, etc. with Response Data)
                    // -------------------------------------------------------------
                    const errorMessage = error.response.data?.errorMessage;

                    if (errorMessage && !errorMessage.includes('Invalid pattern value')) {
                        openNotificationWithIcon(
                            notifyApi,
                            NotificationType.error,
                            'Error Occurred',
                            errorMessage,
                            NotificationType.error
                        );
                    } else {
                        if (navRef.current) {
                            const errorCode = error.code || error.response.status || '500';
                            return navRef.current(`${ROUTE.ERROR}/${errorCode}`);
                        }
                    }
                }
                return Promise.reject(error);
            }
        );
    });
};