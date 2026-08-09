import {getServerUrl} from '../auth/sso-auth';
import {landingPageApi} from './axios.config';
import type {IQuestion, IQuestionPayload} from '../question/question.payload.interface';

const apiServerUrl = getServerUrl('ORIGINAL');

export const getRoles = () => {
    return landingPageApi.get<string[], any>(`${apiServerUrl}/api/v1/user/roles`);
};

export const getQuestions = () => {
    return landingPageApi.get<IQuestion[], any>(`${apiServerUrl}/api/v1/knowledge/questions`);
};

export const createNewQuestion = (payload: IQuestionPayload) => {
    return landingPageApi.post<IQuestion, any>(`${apiServerUrl}/api/v1/knowledge/questions`, payload);
};