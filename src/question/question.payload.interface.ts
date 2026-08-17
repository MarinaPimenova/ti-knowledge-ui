export interface QuestionRecord {
    id: number;
    question: string;
    shortAnswer: string;
    tag: string;
    projectName: string;
}

export interface TagDto {
    id: number;
    tag: string;
}

export interface ProjectDto {
    id: number;
    name: string;
}

export interface ResourceDto {
    id?: number;
    url: string;
    description: string;
}

export interface ResourceRequest {
    url: string;
    description: string;
}

export interface CodeExampleDto {
    language: string;
    sourceCode: string;
}

export interface QuestionLevelDto {
    questionLevelId?: number;
    difficultyCode?: string;
}

export interface QuestionDetails {
    id: number;
    question: string;
    shortAnswer: string;
    detailedAnswer?: string;
    questionLevel: QuestionLevelDto;
    codeExample?: CodeExampleDto;
    tags: TagDto[];
    resources: ResourceDto[];
    projects: ProjectDto[];
    createdBy?: string;
    updatedBy?: string;
}

export interface CreateQuestionRequest {
    question: string;
    shortAnswer: string;
    detailedAnswer?: string;
    questionLevelId?: number;
    codeExample?: CodeExampleDto;
    tagIds: number[];
    projectIds: number[];
    resources: ResourceRequest[];
}