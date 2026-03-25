import type { ColorKey } from '../../../utils/colors'

export type LabelAddArgs = {
    name: string
    color?: ColorKey
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
    color?: ColorKey
    itemOrder?: number
    isFavorite?: boolean
}

export type LabelUpdateOrdersArgs = {
    idOrderMapping: Record<string, number>
}

/** Available label delete cascade modes. */
export const LABEL_DELETE_CASCADE_MODES = ['none', 'all'] as const
/** Cascade mode when deleting a label. */
export type LabelDeleteCascadeMode = (typeof LABEL_DELETE_CASCADE_MODES)[number]

export type LabelDeleteArgs = {
    id: string
    cascade?: LabelDeleteCascadeMode
}

export type LabelDeleteOccurrencesArgs = {
    name: string
}
