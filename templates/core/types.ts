export type Environment = "mock" | "test" | "live";

export type SubjectContext = {
  subjectId: string;
  tenantId: string;
  environment: Environment;
};

export type Failure = { success: false; code: string };

export type Result<T> = { success: true; data: T } | Failure;

export type Asset = { identifier: string; network: string; decimals: number };
