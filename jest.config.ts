import type { Config } from "jest";

const config: Config = {
  testEnvironment: "node",
  preset: "ts-jest/presets/default-esm",
  extensionsToTreatAsEsm: [".ts"],

  transform: {
    "^.+\\.ts$": [
      "ts-jest",
      {
        useESM: true,
        tsconfig: "tsconfig.json",
      },
    ],
  },

  testMatch: ["**/*.spec.ts"],
  clearMocks: true,
};

export default config;
