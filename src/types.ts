export type SohMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface SohClientConfig {
  baseUrl?: string;
  headers?: Record<string, string>;
}

export type QueryParams = Record<
  string,
  string | number | boolean | null | undefined
>;

export type SohHeaders = Record<string, string>;

export type PathParams = Record<string, string | number>;

// URL에서 :param 추출
type ExtractParamKeys<T extends string> =
  T extends `${string}:${infer Param}/${infer Rest}`
    ? Param | ExtractParamKeys<`/${Rest}`>
    : T extends `${string}:${infer Param}`
    ? Param
    : never;

// params 객체 타입 생성
export type InferUrlParams<T extends string> = [ExtractParamKeys<T>] extends [
  never
]
  ? never
  : { [K in ExtractParamKeys<T>]: string | number };

// URL에 path params가 있는지 체크
export type HasUrlParams<T extends string> = T extends `${string}:${string}`
  ? true
  : false;

export type SohBody =
  | Record<string, unknown>
  | FormData
  | Blob
  | ArrayBuffer
  | URLSearchParams
  | string
  | null;

export interface SohRequestState {
  baseUrl?: string;
  query: QueryParams;
  headers: SohHeaders;
}

/**
 * Request ready to be executed
 */
export interface SohRequest<T> {
  json(): Promise<T>;
  text(): Promise<string>;
  blob(): Promise<Blob>;
  arrayBuffer(): Promise<ArrayBuffer>;
  formData(): Promise<FormData>;
  res(): Promise<Response>;
}

/**
 * Request with URL set, ready for HTTP method
 */
export interface SohWithUrl<T = unknown> {
  get(): SohRequest<T>;
  post(body?: SohBody): SohRequest<T>;
  put(body?: SohBody): SohRequest<T>;
  patch(body?: SohBody): SohRequest<T>;
  delete(): SohRequest<T>;
}

/**
 * Soh HTTP client instance
 */
export interface Soh extends SohWithUrl {
  /**
   * Add query parameters
   * @example api.query({ page: 1, limit: 10 }).get()
   */
  query(params: QueryParams): Soh;

  /**
   * Add headers
   * @example api.headers({ "Authorization": "Bearer token" }).get()
   */
  headers(headers: SohHeaders): Soh;

  /**
   * Set URL with optional path parameters
   * @example
   * api.url("/users").get()
   * api.url("/users/:id", { id: 123 }).get()
   */
  url<T = unknown, U extends string = string>(
    url: U,
    ...params: HasUrlParams<U> extends true ? [params: InferUrlParams<U>] : []
  ): SohWithUrl<T>;
}
