const transformIgnorePackages = ['msw', 'until-async', '@mswjs']

export default {
    preset: 'ts-jest/presets/default-esm',
    extensionsToTreatAsEsm: ['.ts'],
    transform: {
        '^.+\\.ts$': [
            'ts-jest',
            {
                useESM: true,
                tsconfig: {
                    module: 'ES2022',
                    moduleResolution: 'bundler',
                },
            },
        ],
        '^.+\\.js$': [
            'ts-jest',
            {
                useESM: true,
                tsconfig: {
                    allowJs: true,
                    module: 'ES2022',
                    moduleResolution: 'bundler',
                },
            },
        ],
    },
    testMatch: ['**/*.test.ts'],
    clearMocks: true,
    testEnvironment: 'node',
    setupFilesAfterEnv: ['<rootDir>/src/test-utils/msw-setup.ts'],
    transformIgnorePatterns: [`/node_modules/(?!(${transformIgnorePackages.join('|')})/)`],
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',
    },
}
