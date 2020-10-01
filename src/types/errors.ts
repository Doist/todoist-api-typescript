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

        // See: https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work
        Object.setPrototypeOf(this, TodoistRequestError.prototype)
    }

    isAuthenticationError = (): boolean => {
        return !!this.httpStatusCode && authenticationErrorCodes.includes(this.httpStatusCode)
    }
}
