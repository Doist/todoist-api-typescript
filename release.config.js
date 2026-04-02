/**
 * @type {import('semantic-release').GlobalConfig}
 */

const isPrerelease = process.env.GITHUB_REF_NAME === 'next'

export default {
    branches: ['main', { name: 'next', prerelease: true }],
    plugins: [
        ['@semantic-release/commit-analyzer', { preset: 'conventionalcommits' }],
        ['@semantic-release/release-notes-generator', { preset: 'conventionalcommits' }],
        // Only update CHANGELOG.md and commit back on stable releases (main branch)
        ...(isPrerelease
            ? []
            : [
                  '@semantic-release/changelog',
                  [
                      '@semantic-release/git',
                      {
                          assets: ['CHANGELOG.md', 'package.json', 'package-lock.json'],
                          // eslint-disable-next-line no-template-curly-in-string
                          message:
                              'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
                      },
                  ],
              ]),
        '@semantic-release/npm',
        '@semantic-release/github',
    ],
}
