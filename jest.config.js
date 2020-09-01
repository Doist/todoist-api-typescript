module.exports = {
    preset: "ts-jest/presets/js-with-ts",
    transform: { '^.+\\.tsx?$': 'ts-jest' },
    clearMocks: true,
    testEnvironment: 'jsdom'
}
