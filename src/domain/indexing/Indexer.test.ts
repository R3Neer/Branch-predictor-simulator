import { describe, expect, it } from "vitest";
import { LsbIndexer } from "./LsbIndexer";
import { ManualIndexer } from "./ManualIndexer";

describe("indexers", () => {
  it("uses selected LSBs and can ignore low alignment bits", () => {
    const indexer = new LsbIndexer();

    expect(
      indexer.resolveIndex(
        { order: 0, branchId: "B1", actual: "T", address: 0x54 },
        { entries: 512, addressBits: 9 }
      )
    ).toMatchObject({ index: 0x54 });

    expect(
      indexer.resolveIndex(
        { order: 0, branchId: "B1", actual: "T", address: 0x54 },
        { entries: 16, addressBits: 4, ignoreLowBits: 2 }
      )
    ).toMatchObject({ index: 5 });
  });

  it("uses manual indices as final table entries", () => {
    const indexer = new ManualIndexer();

    expect(
      indexer.resolveIndex(
        { order: 0, branchId: "B2", actual: "NT", manualIndex: 6 },
        { entries: 8 }
      )
    ).toMatchObject({ index: 6 });
  });

  it("rejects manual indices outside the table", () => {
    const indexer = new ManualIndexer();

    expect(() =>
      indexer.resolveIndex(
        { order: 0, branchId: "B2", actual: "NT", manualIndex: 8 },
        { entries: 8 }
      )
    ).toThrow(RangeError);
  });

  it("handles high 32-bit addresses without signed bitwise truncation", () => {
    const indexer = new LsbIndexer();

    expect(
      indexer.resolveIndex(
        { order: 0, branchId: "B1", actual: "T", address: 0xffff_fffc },
        { entries: 1024, addressBits: 32, ignoreLowBits: 2 }
      )
    ).toMatchObject({ index: 1023 });
  });
});
