export interface QuestionPayload {
    question: string;
    shortAnswer: string;
    resourceUrl?: string;
    description?: string;
}

export interface QuestionRecord {
    id: string;
    question: string;
    shortAnswer: string;
    tag: string;
    projectName: string;
    resourceUrl?: string;
    description?: string;
}