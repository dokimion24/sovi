import {
  HasUrlParams,
  InferUrlParams,
  PathParams,
  QueryParams,
  SohBody,
  SohClientConfig,
  SohHeaders,
  SohMethod,
  SohRequest,
  SohRequestState,
  SohWithUrl,
} from "./types";
import { SohResponse, SohWithUrlImpl } from "./request";
import { isJsonBody, replacePathParams } from "./utils";

function createInitialState(config?: SohClientConfig): SohRequestState {
  return {
    baseUrl: config?.baseUrl,
    query: {},
    headers: config?.headers ?? {},
  };
}

export class SohBuilder {
  private readonly _state: SohRequestState;

  private constructor(state: SohRequestState) {
    this._state = state;
  }

  static create(config?: SohClientConfig) {
    const state = createInitialState(config);
    return new SohBuilder(state);
  }

  private resolveUrl(path: string): string {
    const base = this._state.baseUrl ?? "";

    let fullPath: string;
    if (base) {
      fullPath =
        base.endsWith("/") || path.startsWith("/")
          ? base + path
          : base + "/" + path;
    } else {
      fullPath = path;
    }

    const hasQuery = Object.keys(this._state.query).length > 0;
    if (!hasQuery) {
      return fullPath;
    }

    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(this._state.query)) {
      if (value != null) {
        params.set(key, String(value));
      }
    }

    const separator = fullPath.includes("?") ? "&" : "?";
    return fullPath + separator + params.toString();
  }

  private clone(next: Partial<SohRequestState>): SohBuilder {
    return new SohBuilder({
      ...this._state,
      ...next,
      headers: { ...this._state.headers, ...(next.headers ?? {}) },
      query: {
        ...this._state.query,
        ...(next.query ?? {}),
      },
    });
  }

  query(params: QueryParams) {
    return this.clone({ query: params });
  }

  headers(headers: SohHeaders) {
    return this.clone({ headers });
  }

  private _withPath<T>(path: string): SohWithUrl<T> {
    return new SohWithUrlImpl<T>(this.executeRequest.bind(this), path);
  }

  url<T = unknown, U extends string = string>(
    path: U,
    ...params: HasUrlParams<U> extends true ? [params: InferUrlParams<U>] : []
  ): SohWithUrl<T> {
    let resolvedPath = path as string;
    if (params[0]) {
      resolvedPath = replacePathParams(resolvedPath, params[0] as PathParams);
    }
    return this._withPath<T>(resolvedPath);
  }

  get<T = unknown>(): SohRequest<T> {
    return this._withPath<T>("").get();
  }

  post<T = unknown>(body?: SohBody): SohRequest<T> {
    return this._withPath<T>("").post(body);
  }

  put<T = unknown>(body?: SohBody): SohRequest<T> {
    return this._withPath<T>("").put(body);
  }

  patch<T = unknown>(body?: SohBody): SohRequest<T> {
    return this._withPath<T>("").patch(body);
  }

  delete<T = unknown>(): SohRequest<T> {
    return this._withPath<T>("").delete();
  }

  executeRequest<T>(
    method: SohMethod,
    path: string,
    body?: SohBody
  ): SohRequest<T> {
    const fullUrl = this.resolveUrl(path);
    const isJson = isJsonBody(body, this._state.headers);
    const hasContentType = !!this._state.headers["Content-Type"];

    const promise = fetch(fullUrl, {
      method,
      headers: {
        ...(isJson && !hasContentType
          ? { "Content-Type": "application/json" }
          : {}),
        ...this._state.headers,
      },
      body: isJson ? JSON.stringify(body) : (body as BodyInit),
    });

    return new SohResponse<T>(promise);
  }
}
