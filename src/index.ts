import { SohBuilder } from "./builder";
import type { Soh, SohClientConfig } from "./types";

export type {
  Soh,
  SohClientConfig,
  SohHeaders,
  SohBody,
  SohMethod,
  SohRequest,
  SohWithUrl,
  PathParams,
} from "./types";
export { SohError } from "./error";

type SohFactory = {
  (config?: SohClientConfig): Soh;
  create(config?: SohClientConfig): Soh;
};

export const soh: SohFactory = Object.assign(
  (config?: SohClientConfig): Soh => SohBuilder.create(config),
  {
    create: (config?: SohClientConfig): Soh => SohBuilder.create(config),
  }
);
