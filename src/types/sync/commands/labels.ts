export type LabelAddArgs = {
    name: string
    color?: string
    itemOrder?: number
    isFavorite?: boolean
}

export type LabelRenameArgs = {
    nameOld: string
    nameNew: string
}

export type LabelUpdateArgs = {
    id: string
    name?: string
    color?: string
    itemOrder?: number
    isFavorite?: boolean
}

export type LabelUpdateOrdersArgs = {
    idOrderMapping: Record<string, number>
}

export type LabelDeleteArgs = {
    id: string
    cascade?: 'none' | 'all'
}

export type LabelDeleteOccurrencesArgs = {
    name: string
}
