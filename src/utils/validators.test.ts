import {
    DEFAULT_TASK,
    INVALID_TASK,
    DEFAULT_PROJECT,
    INVALID_PROJECT,
    DEFAULT_SECTION,
    INVALID_SECTION,
    DEFAULT_LABEL,
    INVALID_LABEL,
    DEFAULT_COMMENT,
    INVALID_COMMENT,
    DEFAULT_USER,
    INVALID_USER,
} from '../testUtils/testDefaults'
import {
    validateTask,
    validateTaskArray,
    validateProject,
    validateProjectArray,
    validateSection,
    validateSectionArray,
    validateLabel,
    validateLabelArray,
    validateComment,
    validateCommentArray,
    validateUser,
    validateUserArray,
} from './validators'
import { ValidationError } from 'runtypes'

describe('validators', () => {
    describe('validateTask', () => {
        test('validation passes for a valid task', async () => {
            const result = validateTask(DEFAULT_TASK)
            expect(result).toEqual(DEFAULT_TASK)
        })

        test('validation throws error for an invalid task', async () => {
            expect(() => {
                validateTask(INVALID_TASK)
            }).toThrow(ValidationError)
        })
    })

    describe('validateTaskArray', () => {
        test('validation passes for empty array', async () => {
            const result = validateTaskArray([])
            expect(result).toEqual([])
        })

        test('validation passes for valid task array', async () => {
            const result = validateTaskArray([DEFAULT_TASK])
            expect(result).toEqual([DEFAULT_TASK])
        })

        test('validation throws error for an invalid task array ', async () => {
            expect(() => {
                validateTaskArray([INVALID_TASK])
            }).toThrow(ValidationError)
        })
    })

    describe('validateProject', () => {
        test('validation passes for a valid project', async () => {
            const result = validateProject(DEFAULT_PROJECT)
            expect(result).toEqual(DEFAULT_PROJECT)
        })

        test('validation throws error for an invalid project', async () => {
            expect(() => {
                validateProject(INVALID_PROJECT)
            }).toThrow(ValidationError)
        })
    })

    describe('validateProjectArray', () => {
        test('validation passes for empty array', async () => {
            const result = validateProjectArray([])
            expect(result).toEqual([])
        })

        test('validation passes for valid project array', async () => {
            const result = validateProjectArray([DEFAULT_PROJECT])
            expect(result).toEqual([DEFAULT_PROJECT])
        })

        test('validation throws error for an invalid project array ', async () => {
            expect(() => {
                validateProjectArray([INVALID_PROJECT])
            }).toThrow(ValidationError)
        })
    })

    describe('validateSection', () => {
        test('validation passes for a valid section', async () => {
            const result = validateSection(DEFAULT_SECTION)
            expect(result).toEqual(DEFAULT_SECTION)
        })

        test('validation throws error for an invalid section', async () => {
            expect(() => {
                validateSection(INVALID_SECTION)
            }).toThrow(ValidationError)
        })
    })

    describe('validateSectionArray', () => {
        test('validation passes for empty array', async () => {
            const result = validateSectionArray([])
            expect(result).toEqual([])
        })

        test('validation passes for valid section array', async () => {
            const result = validateSectionArray([DEFAULT_SECTION])
            expect(result).toEqual([DEFAULT_SECTION])
        })

        test('validation throws error for an invalid section array ', async () => {
            expect(() => {
                validateSectionArray([INVALID_SECTION])
            }).toThrow(ValidationError)
        })
    })

    describe('validateLabel', () => {
        test('validation passes for a valid label', async () => {
            const result = validateLabel(DEFAULT_LABEL)
            expect(result).toEqual(DEFAULT_LABEL)
        })

        test('validation throws error for an invalid label', async () => {
            expect(() => {
                validateLabel(INVALID_LABEL)
            }).toThrow(ValidationError)
        })
    })

    describe('validateLabelArray', () => {
        test('validation passes for empty array', async () => {
            const result = validateLabelArray([])
            expect(result).toEqual([])
        })

        test('validation passes for valid label array', async () => {
            const result = validateLabelArray([DEFAULT_LABEL])
            expect(result).toEqual([DEFAULT_LABEL])
        })

        test('validation throws error for an invalid label array ', async () => {
            expect(() => {
                validateLabelArray([INVALID_LABEL])
            }).toThrow(ValidationError)
        })
    })

    describe('validateComment', () => {
        test('validation passes for a valid comment', async () => {
            const result = validateComment(DEFAULT_COMMENT)
            expect(result).toEqual(DEFAULT_COMMENT)
        })

        test('validation throws error for an invalid comment', async () => {
            expect(() => {
                validateComment(INVALID_COMMENT)
            }).toThrow(ValidationError)
        })
    })

    describe('validateCommentArray', () => {
        test('validation passes for empty array', async () => {
            const result = validateCommentArray([])
            expect(result).toEqual([])
        })

        test('validation passes for valid comment array', async () => {
            const result = validateCommentArray([DEFAULT_COMMENT])
            expect(result).toEqual([DEFAULT_COMMENT])
        })

        test('validation throws error for an invalid comment array ', async () => {
            expect(() => {
                validateCommentArray([INVALID_COMMENT])
            }).toThrow(ValidationError)
        })
    })

    describe('validateUser', () => {
        test('validation passes for a valid user', async () => {
            const result = validateUser(DEFAULT_USER)
            expect(result).toEqual(DEFAULT_USER)
        })

        test('validation throws error for an invalid user', async () => {
            expect(() => {
                validateUser(INVALID_USER)
            }).toThrow(ValidationError)
        })
    })

    describe('validateUserArray', () => {
        test('validation passes for empty array', async () => {
            const result = validateUserArray([])
            expect(result).toEqual([])
        })

        test('validation passes for valid comment user', async () => {
            const result = validateUserArray([DEFAULT_USER])
            expect(result).toEqual([DEFAULT_USER])
        })

        test('validation throws error for an invalid user array ', async () => {
            expect(() => {
                validateUserArray([INVALID_USER])
            }).toThrow(ValidationError)
        })
    })
})
