import axios from 'axios';
import type {ApiResponse} from '../services/api.interface';

const apiServerUrl = getServerUrl('ORIGINAL');

const redirectId = '?redirectId=knowledge-url';

const config = {
    withCredentials: true,
    url: `${apiServerUrl}/api/v1/user${redirectId}`,
    method: 'GET',
    headers: {
        'content-type': 'application/json',
    },
};

type userApiCallback = (data: ApiResponse) => any;

export const ssoAuthProvider = {

    getUserProfile: function (callback: userApiCallback): void {
        let data: ApiResponse;
        let response: any;

        (async () => {
            try {
                response = await axios(config);
                data = {data: response.data, error: null};
            } catch (error) {
                // Network Error - when session is expired
                let errorMessage = 'Unknown error';
                // @ts-ignore
                if (error !== undefined && error.message === 'Network Error') {
                    // @ts-ignore
                    errorMessage = error.message;
                } else {
                    // @ts-ignore
                    errorMessage = `Error: ${error?.code}. Status: ${error.response?.status}`;
                }
                data = {data: undefined, error: {message: errorMessage}};

                // @ts-ignore
/*                if (error !== undefined && (error.response?.status === 401 || error.response?.status === 403)) {
                    login();
                }*/
            }
        })()
            .catch((reason) => {
                data = {data: undefined, error: {message: reason! || 'Unknown error'}};
            })
            .finally(() => {
                callback(data);
            });
    },

};

export function getCookieValue(cname: string): string {
    const cookieName = cname + '=';
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for (const element of ca) {
        let c = element;
        while (c.startsWith(' ')) {
            c = c.substring(1);
        }
        if (c.startsWith(cookieName)) {
            return c.substring(cookieName.length, c.length);
        }
    }
    return '';
}

export function getAuthUrl(): string {
    const protocol = window.location.protocol;
    let port = window.location.port ? ':' + window.location.port : '';
    if (port === ':3000' || port === ':5000') {
        port = ':8080';
    }
    return `${protocol}//${window.location.hostname}${port}`;
}

export function getServerUrl(cname: string): string {
    const apiServerUrl = getCookieValue(cname);
    if (apiServerUrl === '') {
        return getAuthUrl();
    }
    return apiServerUrl;
}

export function reset() {
    window.location.href = apiServerUrl + '/logout';
}

export function refresh(event: React.MouseEvent<HTMLElement>) {
    event.preventDefault();
    login();
}

export function login() {
    window.location.href = apiServerUrl + '/oauth2/authorization/okta' + redirectId;
}
