export default {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  errorOnDeprecated: true,
  moduleDirectories: ["node_modules", "src"],
  preset: "ts-jest",
  roots: ["src"],
  setupFilesAfterEnv: ["./jest.setup.ts"],
};
