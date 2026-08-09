export interface IProjectPayload {
    name: string;
    lead: string;
}

export interface IProject {
    id: bigint;
    name: string;
    lead: string;
    tag: string;
    questionsCount: bigint;
}