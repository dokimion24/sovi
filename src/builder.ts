import { SohClientConfig, SohRequestState } from "./types";

function createInitialState(
  url?: string,
  config?: SohClientConfig
): SohRequestState {
  return {
    baseUrl: config?.baseUrl,
    url: url ?? "",
    query: {},
    headers: {},
    body: undefined,
  };
}

export class SohBuilder {
  private readonly _state: SohRequestState;

  private constructor(state: SohRequestState) {
    this._state = state;
  }

  static create(url?: string, config?: SohClientConfig) {
    const state = createInitialState(url, config);
    return new SohBuilder(state);
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
}
