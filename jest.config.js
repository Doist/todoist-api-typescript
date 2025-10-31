export default {
    preset: 'ts-jest/presets/default-esm',
    extensionsToTreatAsEsm: ['.ts'],
    transform: {
        '^.+\\.ts$': ['ts-jest', { useESM: true }],
    },
    testMatch: ['**/*.test.ts'],
    clearMocks: true,
    testEnvironment: 'node',
    transformIgnorePatterns: [
        'node_modules/(?!(msw|@mswjs|@bundled-es-modules|until-async|chalk|@open-draft|@inquirer|strict-event-emitter)/)',
    ],
}
