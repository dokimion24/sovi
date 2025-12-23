import { SoviBuilder } from "./builder";
import type { Sovi, SoviClientConfig } from "./types";

export type {
  Sovi,
  SoviClientConfig,
  SoviHeaders,
  SoviBody,
  SoviMethod,
  SoviRequest,
  SoviWithUrl,
  PathParams,
} from "./types";
export { SoviError } from "./error";

type SoviFactory = {
  (config?: SoviClientConfig): Sovi;
  create(config?: SoviClientConfig): Sovi;
};

export const sovi: SoviFactory = Object.assign(
  (config?: SoviClientConfig): Sovi => SoviBuilder.create(config),
  {
    create: (config?: SoviClientConfig): Sovi => SoviBuilder.create(config),
  }
);
