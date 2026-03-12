import { getDefaultDispatcher, resetDefaultDispatcherForTests } from './http-dispatcher'

describe('http-dispatcher', () => {
    afterEach(async () => {
        await resetDefaultDispatcherForTests()
    })

    test('returns an EnvHttpProxyAgent in Node', async () => {
        const dispatcher = await getDefaultDispatcher()
        const { EnvHttpProxyAgent } = await import('undici')

        expect(dispatcher).toBeDefined()
        expect(dispatcher).toBeInstanceOf(EnvHttpProxyAgent)
    })

    test('caches the dispatcher instance', async () => {
        const firstDispatcher = await getDefaultDispatcher()
        const secondDispatcher = await getDefaultDispatcher()

        expect(secondDispatcher).toBe(firstDispatcher)
    })

    test('reset creates a new dispatcher', async () => {
        const firstDispatcher = await getDefaultDispatcher()

        await resetDefaultDispatcherForTests()

        const secondDispatcher = await getDefaultDispatcher()

        expect(secondDispatcher).toBeDefined()
        expect(secondDispatcher).not.toBe(firstDispatcher)
    })
})
