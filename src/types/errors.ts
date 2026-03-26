import { CustomError } from 'ts-custom-error'

const authenticationErrorCodes = [401, 403]

export class TodoistRequestError extends CustomError {
    public constructor(
        public message: string,
        public httpStatusCode?: number,
        public responseData?: unknown,
    ) {
        super(message)
        Object.defineProperty(this, 'name', { value: 'TodoistRequestError' })
    }

    isAuthenticationError = (): boolean => {
        if (!this.httpStatusCode) {
            return false
        }

        return authenticationErrorCodes.includes(this.httpStatusCode)
    }
}

export class TodoistArgumentError extends CustomError {
    public constructor(public message: string) {
        super(message)
        Object.defineProperty(this, 'name', { value: 'TodoistArgumentError' })
    }
}
