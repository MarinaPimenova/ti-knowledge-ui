import {landingPageApi} from './axios.config';
import type {QuestionRecord, QuestionPayload} from '../question/question.payload.interface';

export const getQuestions = () => {
    return landingPageApi.get<QuestionRecord[], any>(`/api/v1/knowledge/questions`);
};

export const createNewQuestion = (payload: QuestionPayload) => {
    return landingPageApi.post<QuestionRecord, any>(`/api/v1/knowledge/questions`, payload);
};