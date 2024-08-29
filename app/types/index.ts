export interface JobResult {
    id: number;
    title: string;
    agency: string;
    type: string;
    education: string;
    major: string;
}

export type ViewMode = "grid" | "table";