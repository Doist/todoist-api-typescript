import { setupRestClientMock } from './mocks'
import { ValidationError } from 'runtypes'

// Has to use 'any' to express constructor type
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function assertInstance<T extends new (...args: any) => any>(
    value: unknown,
    type: T,
): asserts value is InstanceType<T> {
    if (value instanceof type) {
        return
    }

    throw new TypeError(`Unexpected type ${typeof value}`)
}

export async function assertInputValidationError(apiCall: () => Promise<unknown>): Promise<void> {
    const requestMock = setupRestClientMock(undefined)

    expect.assertions(1)

    try {
        await apiCall()
    } catch (e: unknown) {
        assertInstance(e, ValidationError)
        expect(requestMock).not.toBeCalled()
    }
}
