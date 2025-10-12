const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*/{ts,tsx}", "!src/**/types/**"],
  coverageThreshold: {
    global: {branches: 80, functions: 80, lines: 80, statements: 80}
  }
  /*transform: {
    ...tsJestTransformCfg,
  },*/
};