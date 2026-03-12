import type { Dispatcher } from 'undici'

const KEEP_ALIVE_OPTIONS = {
    keepAliveTimeout: 1,
    keepAliveMaxTimeout: 1,
}

let defaultDispatcherPromise: Promise<Dispatcher> | undefined

export function getDefaultDispatcher(): Promise<Dispatcher | undefined> {
    if (!isNodeEnvironment()) {
        return Promise.resolve(undefined)
    }

    if (!defaultDispatcherPromise) {
        defaultDispatcherPromise = createDefaultDispatcher().catch((error) => {
            defaultDispatcherPromise = undefined
            throw error
        })
    }

    return defaultDispatcherPromise
}

export async function resetDefaultDispatcherForTests(): Promise<void> {
    if (!defaultDispatcherPromise) {
        return
    }

    const dispatcherPromise = defaultDispatcherPromise
    defaultDispatcherPromise = undefined

    await dispatcherPromise.then(
        (dispatcher) => dispatcher.close(),
        () => undefined,
    )
}

async function createDefaultDispatcher(): Promise<Dispatcher> {
    const { EnvHttpProxyAgent } = await import('undici')

    return new EnvHttpProxyAgent(KEEP_ALIVE_OPTIONS)
}

function isNodeEnvironment(): boolean {
    return typeof process !== 'undefined' && Boolean(process.versions?.node)
}
