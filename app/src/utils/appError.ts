class AppError extends Error {
    statusCode: number;
    status: string;
    isOperationError: boolean;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.status = this.getStatusFromStatusCode(statusCode);
        this.isOperationError = true;

        Error.captureStackTrace(this, this.constructor);
    }

    private getStatusFromStatusCode(statusCode: number): string {
        if (statusCode >= 100 && statusCode < 200) {
            return 'informational';
        } else if (statusCode >= 200 && statusCode < 300) {
            return 'success';
        } else if (statusCode >= 300 && statusCode < 400) {
            return 'redirection';
        } else if (statusCode >= 400 && statusCode < 500) {
            return 'client error';
        } else if (statusCode >= 500 && statusCode < 600) {
            return 'server error';
        } else {
            return 'unknown';
        }
    }
}

export default AppError;
