import { assertPositiveInteger, toBitString } from "../shared/BitString";
import type { BranchExecution } from "../simulation/BranchSequence";
import type { Indexer, IndexResult } from "./Indexer";

export interface LsbIndexConfig {
  readonly entries: number;
  readonly addressBits: number;
  readonly ignoreLowBits?: number;
}

export class LsbIndexer implements Indexer<LsbIndexConfig> {
  resolveIndex(execution: BranchExecution, config: LsbIndexConfig): IndexResult {
    assertPositiveInteger(config.entries, "entries");
    assertPositiveInteger(config.addressBits, "addressBits");
    if (config.addressBits > 32) {
      throw new RangeError("addressBits must be 32 or less for numeric RISC-V addresses");
    }

    const ignored = config.ignoreLowBits ?? 0;
    if (!Number.isInteger(ignored) || ignored < 0) {
      throw new RangeError("ignoreLowBits must be a non-negative integer");
    }

    const address = execution.address;
    if (address === undefined) {
      throw new Error(`branch ${execution.branchId} needs an address for LSB indexing`);
    }
    if (!Number.isInteger(address) || address < 0) {
      throw new RangeError("address must be a non-negative integer");
    }

    const shiftedAddress = Math.floor(address / 2 ** ignored);
    const mask = 2 ** config.addressBits - 1;
    const rawIndex = shiftedAddress % 2 ** config.addressBits;
    const index = rawIndex % config.entries;

    return {
      index,
      calculation: {
        policy: "lsb",
        pcBits: toBitString(rawIndex, config.addressBits),
        operation: ignored > 0 ? `address >> ${ignored} & ${mask}` : `address & ${mask}`,
        resultIndex: String(index)
      }
    };
  }
}
