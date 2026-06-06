import { describe, expect, it } from "vitest";
import { SaturatingCounter } from "./SaturatingCounter";

describe("SaturatingCounter", () => {
  it("predicts NT below the taken threshold and T at or above it", () => {
    expect(new SaturatingCounter(2, 0).predict()).toBe("NT");
    expect(new SaturatingCounter(2, 1).predict()).toBe("NT");
    expect(new SaturatingCounter(2, 2).predict()).toBe("T");
    expect(new SaturatingCounter(2, 3).predict()).toBe("T");
  });

  it("increments and decrements with saturation", () => {
    const weakTaken = new SaturatingCounter(2, 2);

    expect(weakTaken.update("T").toBits()).toBe("11");
    expect(weakTaken.update("T").update("T").toBits()).toBe("11");
    expect(weakTaken.update("NT").toBits()).toBe("01");
    expect(new SaturatingCounter(2, 0).update("NT").toBits()).toBe("00");
  });

  it("rejects values that do not fit the configured width", () => {
    expect(() => new SaturatingCounter(2, 4)).toThrow(RangeError);
    expect(() => new SaturatingCounter(0, 0)).toThrow(RangeError);
  });
});
