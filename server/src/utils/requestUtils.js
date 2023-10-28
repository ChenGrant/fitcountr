const BAD_REQUEST_STATUS_CODE = 400;
const RESOURCE_NOT_FOUND_STATUS_CODE = 404;
const INTERNAL_SERVER_ERROR_STATUS_CODE = 500;

class RequestError extends Error {
    constructor(responseMessage, responseStatusCode) {
        super(responseMessage);
        this.responseMessage = responseMessage;
        this.responseStatusCode = responseStatusCode;
    }
}

const sendErrorResponse = (res, err) => {
    const responseStatusCode =
        err.responseStatusCode || INTERNAL_SERVER_ERROR_STATUS_CODE;
    const errorMessage = err.responseMessage || "";
    res.status(responseStatusCode).json({ error: { message: errorMessage } });
};

module.exports = {
    INTERNAL_SERVER_ERROR_STATUS_CODE,
    RESOURCE_NOT_FOUND_STATUS_CODE,
    BAD_REQUEST_STATUS_CODE,
    RequestError,
    sendErrorResponse,
};
