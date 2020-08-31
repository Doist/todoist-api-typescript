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
