import { Label, Project, Section, Task, User, Comment } from '../types'

export const validateTask = (input: unknown): Task => Task.check(input)
export const validateTaskArray = (input: unknown[]): Task[] => input.map(validateTask)

export const validateProject = (input: unknown): Project => Project.check(input)
export const validateProjectArray = (input: unknown[]): Project[] => input.map(validateProject)

export const validateSection = (input: unknown): Section => Section.check(input)
export const validateSectionArray = (input: unknown[]): Section[] => input.map(validateSection)

export const validateLabel = (input: unknown): Label => Label.check(input)
export const validateLabelArray = (input: unknown[]): Label[] => input.map(validateLabel)

export const validateComment = (input: unknown): Comment => Comment.check(input)
export const validateCommentArray = (input: unknown[]): Comment[] => input.map(validateComment)

export const validateUser = (input: unknown): User => User.check(input)
export const validateUserArray = (input: unknown[]): User[] => input.map(validateUser)
