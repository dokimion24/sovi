import type { PathParams, SohHeaders } from "./types";

export function replacePathParams(path: string, params: PathParams): string {
  return path.replace(/:([a-zA-Z_][a-zA-Z0-9_]*)/g, (_, key) => {
    const value = params[key];
    if (value === undefined) {
      throw new Error(`Missing path parameter: ${key}`);
    }
    return String(value);
  });
}

export function isJsonBody(body: unknown, headers: SohHeaders): boolean {
  if (!body || typeof body !== "object") return false;
  if (body instanceof FormData || body instanceof Blob) return false;

  const contentType = headers["Content-Type"];
  return !contentType || contentType.includes("application/json");
}
