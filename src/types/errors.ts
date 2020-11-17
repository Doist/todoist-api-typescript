import { CustomError } from 'ts-custom-error'

const authenticationErrorCodes = [401, 403]

export class TodoistRequestError extends CustomError {
    public constructor(
        public message: string,
        public httpStatusCode?: number,
        public responseData?: unknown,
    ) {
        super(message)
    }

    isAuthenticationError = (): boolean => {
        return !!this.httpStatusCode && authenticationErrorCodes.includes(this.httpStatusCode)
    }
}
