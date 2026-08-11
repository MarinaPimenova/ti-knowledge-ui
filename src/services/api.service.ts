import {getServerUrl} from '../auth/sso-auth';
import {landingPageApi} from './axios.config';
import type {QuestionRecord, QuestionPayload} from '../question/question.payload.interface';

const apiServerUrl = getServerUrl('ORIGINAL');

export const getQuestions = () => {
    return landingPageApi.get<QuestionRecord[], any>(`${apiServerUrl}/api/v1/knowledge/questions`);
};

export const createNewQuestion = (payload: QuestionPayload) => {
    return landingPageApi.post<QuestionRecord, any>(`${apiServerUrl}/api/v1/knowledge/questions`, payload);
};