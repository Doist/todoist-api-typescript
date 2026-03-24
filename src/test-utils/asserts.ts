// Has to use 'any' to express constructor type
// oxlint-disable-next-line no-explicit-any
export function assertInstance<T extends new (...args: any) => any>(
    value: unknown,
    type: T,
): asserts value is InstanceType<T> {
    if (value instanceof type) {
        return
    }

    throw new TypeError(`Unexpected type ${typeof value}`)
}
