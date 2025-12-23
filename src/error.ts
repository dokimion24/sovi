export class SoviError extends Error {
  readonly status: number;
  readonly statusText: string;
  readonly response: Response;

  constructor(response: Response) {
    super(`HTTP ${response.status}: ${response.statusText}`);
    this.name = "SoviError";
    this.status = response.status;
    this.statusText = response.statusText;
    this.response = response;
  }
}
