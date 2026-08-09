export interface IQuestionPayload {
    question: string;
    shortAnswer: string;
    resourceUrl: string;
    description: string; // resource's description
}

export interface IQuestion {
    id: bigint;
    question: string;
    shortAnswer: string;
    tag: string;
    projectName: string;
    resourceUrl: string;
    description: string; // resource's description
}