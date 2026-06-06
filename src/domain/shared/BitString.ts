export function toBitString(value: number, width: number): string {
  assertNonNegativeInteger(value, "value");
  assertPositiveInteger(width, "width");

  const maxValue = 2 ** width - 1;
  if (value > maxValue) {
    throw new RangeError(`value ${value} does not fit in ${width} bits`);
  }

  return value.toString(2).padStart(width, "0");
}

export function parseBitString(value: string): number {
  if (!/^[01]+$/.test(value)) {
    throw new Error(`invalid bit string: ${value}`);
  }

  return Number.parseInt(value, 2);
}

export function assertPositiveInteger(value: number, name: string): void {
  if (!Number.isInteger(value) || value <= 0) {
    throw new RangeError(`${name} must be a positive integer`);
  }
}

export function assertNonNegativeInteger(value: number, name: string): void {
  if (!Number.isInteger(value) || value < 0) {
    throw new RangeError(`${name} must be a non-negative integer`);
  }
}
