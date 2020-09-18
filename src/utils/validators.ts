import { createAssertType } from 'typescript-is'
import { Label, Project, Section, Task, User, Comment } from '../types'

export const validateTask = createAssertType<Task>()
export const validateTaskArray = createAssertType<Task[]>()

export const validateProject = createAssertType<Project>()
export const validateProjectArray = createAssertType<Project[]>()

export const validateSection = createAssertType<Section>()
export const validateSectionArray = createAssertType<Section[]>()

export const validateLabel = createAssertType<Label>()
export const validateLabelArray = createAssertType<Label[]>()

export const validateComment = createAssertType<Comment>()
export const validateCommentArray = createAssertType<Comment[]>()

export const validateUser = createAssertType<User>()
export const validateUserArray = createAssertType<User[]>()
