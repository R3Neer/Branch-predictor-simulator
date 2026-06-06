export type Outcome = "T" | "NT";

export const OUTCOME = {
  taken: "T",
  notTaken: "NT"
} as const satisfies Record<string, Outcome>;
