import { landingPageApi } from './axios.config';
import type {
    QuestionRecord,
    QuestionDetails,
    CreateQuestionRequest, TagDto, ProjectDto, QuestionLevelDto
} from '../question/question.payload.interface';

const QUESTIONS_URL = '/api/v1/knowledge/questions';

export const getQuestions = () => {
    return landingPageApi.get<QuestionRecord[]>(QUESTIONS_URL);
};

export const getQuestion = (id: number) => {
    return landingPageApi.get<QuestionDetails>(
        `${QUESTIONS_URL}/${id}`
    );
};

export const createNewQuestion = (
    payload: CreateQuestionRequest
) => {
    return landingPageApi.post<QuestionDetails>(
        QUESTIONS_URL,
        payload
    );
};

export const updateQuestion = (
    id: number,
    payload: QuestionDetails
) => {
    return landingPageApi.put<QuestionDetails>(
        `${QUESTIONS_URL}/${id}`,
        payload
    );
};

export const deleteQuestion = (id: number) => {
    return landingPageApi.delete<void>(
        `${QUESTIONS_URL}/${id}`
    );
};

// projects
export const getProjects = () => {
    return landingPageApi.get<ProjectDto[]>(`/api/v1/knowledge/projects`);
};

// tags
export const getTags = () => {
    return landingPageApi.get<TagDto[]>(`/api/v1/knowledge/tags`);
};

// question level
export const getQuestionLevels = () => {
    return landingPageApi.get<QuestionLevelDto[]>(`/api/v1/knowledge/qlevels`);
};
