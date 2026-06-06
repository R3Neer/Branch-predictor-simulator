import type { OfficialTemplate } from "./OfficialTemplate";

export const officialTemplates: readonly OfficialTemplate[] = [
  {
    id: "exercise-1-one-level-2bit",
    exerciseNumber: 1,
    title: "Ejercicio 1: predictor de 2 bits",
    source: "ref_docs/Problemas.pdf",
    statement:
      "Codigo con un unico salto. Estado inicial 10 y comportamientos NT-T-NT-NT-T-T.",
    branchSequence: {
      executions: outcomes(["NT", "T", "NT", "NT", "T", "T"]).map((actual, order) => ({
        order,
        branchId: "B1",
        actual,
        manualIndex: 0
      })),
      loops: []
    },
    variants: [
      {
        id: "one-level-2bit",
        title: "Predictor de 2 bits",
        predictorConfig: {
          type: "one-level",
          counterBits: 2,
          entries: 1,
          initialCounterValue: 2,
          indexPolicy: { type: "manual", entries: 1 }
        },
        expectedStatistics: { hits: 1, misses: 5, hitRate: 1 / 6, missRate: 5 / 6 }
      }
    ]
  },
  {
    id: "exercise-2-two-level",
    exerciseNumber: 2,
    title: "Ejercicio 2: multinivel (1,1) y (1,2)",
    source: "ref_docs/Problemas.pdf",
    statement:
      "Secuencia B1/B2/B3 tras estar repetidamente tomados. Comparar predictores (1,1) y (1,2).",
    branchSequence: {
      executions: outcomes(["NT", "T", "NT", "T", "NT", "T", "NT", "T", "NT", "T", "NT", "T", "NT", "T", "NT"]).map(
        (actual, order) => ({
          order,
          branchId: `B${(order % 3) + 1}`,
          actual,
          manualIndex: order % 3
        })
      ),
      loops: []
    },
    variants: [
      {
        id: "two-level-1-1",
        title: "Predictor multinivel (1,1)",
        predictorConfig: {
          type: "two-level",
          historyBits: 1,
          counterBits: 1,
          firstLevelEntries: 3,
          countersPerEntry: 2,
          initialHistoryValue: 1,
          initialCounterValue: 1,
          indexPolicy: { type: "manual", entries: 3 }
        },
        expectedStatistics: { hits: 9, misses: 6, missRate: 6 / 15 }
      },
      {
        id: "two-level-1-2",
        title: "Predictor multinivel (1,2)",
        predictorConfig: {
          type: "two-level",
          historyBits: 1,
          counterBits: 2,
          firstLevelEntries: 3,
          countersPerEntry: 2,
          initialHistoryValue: 1,
          initialCounterValue: 3,
          indexPolicy: { type: "manual", entries: 3 }
        },
        expectedStatistics: { hits: 3, misses: 12, missRate: 12 / 15 }
      }
    ]
  },
  {
    id: "exercise-3-two-level-3-2",
    exerciseNumber: 3,
    title: "Ejercicio 3: predictor (3,2), 512 entradas, 9 LSBs",
    source: "ref_docs/Problemas.pdf",
    statement:
      "Predictor (3,2) con 512 entradas y acceso directo usando 9 LSBs. Sin aliasing entre B1 y B2.",
    branchSequence: {
      executions: outcomes(["NT", "T", "NT", "T", "NT", "T", "NT", "T", "NT", "T", "NT", "T", "T", "T", "NT"]).map(
        (actual, order) => ({
          order,
          branchId: orderSequence(["B1", "B2", "B2", "B1", "B2", "B1", "B1", "B1", "B2", "B1", "B2", "B2", "B1", "B2", "B2"], order),
          actual,
          address: orderSequence([0x101, 0x202, 0x202, 0x101, 0x202, 0x101, 0x101, 0x101, 0x202, 0x101, 0x202, 0x202, 0x101, 0x202, 0x202], order)
        })
      ),
      loops: []
    },
    variants: [
      {
        id: "two-level-3-2-512",
        title: "Predictor (3,2)",
        predictorConfig: {
          type: "two-level",
          historyBits: 3,
          counterBits: 2,
          firstLevelEntries: 512,
          countersPerEntry: 8,
          initialHistoryValue: 0,
          initialCounterValue: 1,
          indexPolicy: { type: "lsb", entries: 512, addressBits: 9 }
        },
        expectedStatistics: { hits: 10, misses: 5, memoryBits: 8192, notes: "Memoria oficial: 1 kB." }
      }
    ]
  },
  {
    id: "exercise-4-global-correlated-2-2",
    exerciseNumber: 4,
    title: "Ejercicio 4: correlacionado (2,2) con B1/B2",
    source: "ref_docs/Problemas.pdf",
    statement:
      "Fragmento con saltos B1 y B2, GHR inicial 11 y entradas inicialmente 11.",
    branchSequence: {
      executions: outcomes(["NT", "T", "T", "T", "NT", "T", "T", "T", "NT", "T", "NT", "NT"]).map(
        (actual, order) => ({
          order,
          branchId: order % 2 === 0 ? "B1" : "B2",
          actual,
          manualIndex: order % 2
        })
      ),
      loops: []
    },
    variants: [
      {
        id: "global-correlated-2-2",
        title: "Correlacionado (2,2)",
        predictorConfig: {
          type: "two-level",
          historyBits: 2,
          counterBits: 2,
          firstLevelEntries: 2,
          countersPerEntry: 4,
          initialHistoryValue: 3,
          initialCounterValue: 3,
          indexPolicy: { type: "manual", entries: 2 }
        },
        expectedStatistics: { hits: 8, misses: 4, missRate: 4 / 12 }
      }
    ]
  },
  {
    id: "exercise-5-gshare",
    exerciseNumber: 5,
    title: "Ejercicio 5: gshare",
    source: "ref_docs/Problemas.pdf",
    statement:
      "Predictor gshare con 256 predictores de 2 bits, GHR inicial NT y salto en 0x54.",
    branchSequence: {
      executions: outcomes([...Array.from({ length: 15 }, () => "T"), "NT"]).map((actual, order) => ({
        order,
        branchId: "B1",
        actual,
        address: 0x54
      })),
      loops: []
    },
    variants: [
      {
        id: "gshare-256-2bit",
        title: "gshare 256 entradas",
        predictorConfig: {
          type: "gshare",
          ghrBits: 8,
          ghrBitsUsed: 8,
          pcBits: 8,
          phtEntries: 256,
          counterBits: 2,
          initialGhrValue: 0,
          initialCounterValue: 0
        },
        expectedStatistics: { hits: 5, misses: 11 }
      }
    ]
  },
  {
    id: "exercise-7-pattern-ttn",
    exerciseNumber: 7,
    title: "Ejercicio 7: patron T-T-NT con predictor (2,2)",
    source: "ref_docs/Problemas.pdf",
    statement:
      "Salto con patron T-T-NT usando predictor dinamico (2,2), estructuras inicializadas a cero.",
    branchSequence: {
      executions: outcomes(["T", "T", "NT", "T", "T", "NT", "T", "T", "NT", "T", "T", "NT", "T"]).map(
        (actual, order) => ({ order, branchId: "B1", actual, manualIndex: 0 })
      ),
      loops: []
    },
    variants: [
      {
        id: "two-level-2-2-single-pattern",
        title: "Predictor (2,2)",
        predictorConfig: {
          type: "two-level",
          historyBits: 2,
          counterBits: 2,
          firstLevelEntries: 1,
          countersPerEntry: 4,
          initialHistoryValue: 0,
          initialCounterValue: 0,
          indexPolicy: { type: "manual", entries: 1 }
        },
        expectedStatistics: { notes: "La solucion oficial indica acierto estable desde la ejecucion 8." }
      }
    ]
  }
];

function outcomes(values: readonly string[]) {
  return values.map((value) => {
    if (value !== "T" && value !== "NT") {
      throw new Error(`invalid outcome ${value}`);
    }
    return value;
  });
}

function orderSequence<T>(values: readonly T[], order: number): T {
  return values[order];
}
