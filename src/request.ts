import { SoviBody, SoviMethod, SoviRequest, SoviWithUrl } from "./types";
import { SoviError } from "./error";

export type ExecuteRequestFn = <T>(
  method: SoviMethod,
  path: string,
  body?: SoviBody
) => SoviRequest<T>;

export class SoviResponse<T> implements SoviRequest<T> {
  private readonly _promise: Promise<Response>;

  constructor(promise: Promise<Response>) {
    this._promise = promise;
  }

  private async _resolve(): Promise<Response> {
    const res = await this._promise;
    if (!res.ok) {
      throw new SoviError(res);
    }
    return res;
  }

  async json(): Promise<T> {
    const res = await this._resolve();
    return res.json() as Promise<T>;
  }

  async text(): Promise<string> {
    const res = await this._resolve();
    return res.text();
  }

  async blob(): Promise<Blob> {
    const res = await this._resolve();
    return res.blob();
  }

  async arrayBuffer(): Promise<ArrayBuffer> {
    const res = await this._resolve();
    return res.arrayBuffer();
  }

  async formData(): Promise<FormData> {
    const res = await this._resolve();
    return res.formData();
  }

  res(): Promise<Response> {
    return this._promise;
  }
}

export class SoviWithUrlImpl<T> implements SoviWithUrl<T> {
  private readonly _execute: ExecuteRequestFn;
  private readonly _path: string;

  constructor(execute: ExecuteRequestFn, path: string) {
    this._execute = execute;
    this._path = path;
  }

  get(): SoviRequest<T> {
    return this._execute<T>("GET", this._path);
  }

  post(body?: SoviBody): SoviRequest<T> {
    return this._execute<T>("POST", this._path, body);
  }

  put(body?: SoviBody): SoviRequest<T> {
    return this._execute<T>("PUT", this._path, body);
  }

  patch(body?: SoviBody): SoviRequest<T> {
    return this._execute<T>("PATCH", this._path, body);
  }

  delete(): SoviRequest<T> {
    return this._execute<T>("DELETE", this._path);
  }
}
