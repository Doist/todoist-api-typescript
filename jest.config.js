module.exports = {
    preset: 'ts-jest',
    transform: { '^.+\\.ts': 'ts-jest' },
    testMatch: ['**/*.test.ts'],
    clearMocks: true,
    testEnvironment: 'node',
}
