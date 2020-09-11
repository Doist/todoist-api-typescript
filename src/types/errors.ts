const authenticationErrorCodes = [401, 403]

export class TodoistRequestError extends Error {
    constructor(
        public message: string,
        public httpStatusCode?: number,
        public responseData?: unknown,
    ) {
        super(message)
        this.name = this.constructor.name

        Error.captureStackTrace(this, this.constructor)
    }

    isAuthenticationError = (): boolean => {
        return !!this.httpStatusCode && authenticationErrorCodes.includes(this.httpStatusCode)
    }
}

export class ResponseValidationError extends Error {
    constructor(public responseData: unknown) {
        super('API response was in an invalid format')
        this.name = 'ResponseValidationError'
    }
}
