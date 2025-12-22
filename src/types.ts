export type SohMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface SohClientConfig {
  baseUrl?: string;
}

export type QueryParams = Record<
  string,
  string | number | boolean | null | undefined
>;

export type SohHeaders = Record<string, string>;

export interface SohRequestState {
  baseUrl?: string;
  url: string;
  query: QueryParams;
  headers: SohHeaders;
  body?: BodyInit | null;
}
