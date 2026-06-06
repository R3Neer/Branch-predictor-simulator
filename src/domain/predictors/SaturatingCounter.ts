import type { Outcome } from "../shared/Outcome";
import { assertNonNegativeInteger, assertPositiveInteger, toBitString } from "../shared/BitString";

export class SaturatingCounter {
  readonly bits: number;
  readonly value: number;

  constructor(bits: number, value: number) {
    assertPositiveInteger(bits, "bits");
    assertNonNegativeInteger(value, "value");

    const maxValue = 2 ** bits - 1;
    if (value > maxValue) {
      throw new RangeError(`counter value ${value} exceeds ${bits}-bit maximum ${maxValue}`);
    }

    this.bits = bits;
    this.value = value;
  }

  predict(): Outcome {
    return this.value >= this.takenThreshold() ? "T" : "NT";
  }

  update(actual: Outcome): SaturatingCounter {
    if (actual === "T") {
      return new SaturatingCounter(this.bits, Math.min(this.maxValue(), this.value + 1));
    }

    return new SaturatingCounter(this.bits, Math.max(0, this.value - 1));
  }

  toBits(): string {
    return toBitString(this.value, this.bits);
  }

  maxValue(): number {
    return 2 ** this.bits - 1;
  }

  private takenThreshold(): number {
    return 2 ** (this.bits - 1);
  }
}
