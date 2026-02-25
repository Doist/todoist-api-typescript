export type FilterAddArgs = {
    name: string
    query: string
    color?: string
    itemOrder?: number
    isFavorite?: boolean
}

export type FilterUpdateArgs = {
    id: string
    name?: string
    query?: string
    color?: string
    itemOrder?: number
    isFavorite?: boolean
}

export type FilterUpdateOrdersArgs = {
    idOrderMapping: Record<string, number>
}

export type FilterDeleteArgs = {
    id: string
}
