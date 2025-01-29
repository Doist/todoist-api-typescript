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
