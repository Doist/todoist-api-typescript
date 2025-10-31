module.exports = {
    preset: 'ts-jest',
    transform: { '^.+\\.ts': 'ts-jest' },
    testMatch: ['**/*.test.ts'],
    clearMocks: true,
    testEnvironment: 'node',
    extensionsToTreatAsEsm: ['.ts'],
    globals: {
        'ts-jest': {
            useESM: true,
        },
    },
    transformIgnorePatterns: [
        'node_modules/(?!(msw|@mswjs|@bundled-es-modules|until-async|chalk|@open-draft|@inquirer|strict-event-emitter)/)',
    ],
}
