const BAD_REQUEST_STATUS_CODE = 400;
const UNAUTHORIZED_STATUS_CODE = 401;
const FORBIDDEN_STATUS_CODE = 403;
const RESOURCE_NOT_FOUND_STATUS_CODE = 404;
const INTERNAL_SERVER_ERROR_STATUS_CODE = 500;

class RequestError extends Error {
    constructor(
        responseMessage,
        responseStatusCode = INTERNAL_SERVER_ERROR_STATUS_CODE
    ) {
        super(responseMessage);
        this.responseMessage = responseMessage;
        this.responseStatusCode = responseStatusCode;
    }

    setResponseStatusCode(responseStatusCode) {
        this.responseStatusCode = responseStatusCode;
    }
}

const sendErrorResponse = (
    res,
    errorMessage,
    errorMessagesToResponseStatusCodes = {}
) => {
    let responseData = { error: true };
    let responseStatusCode = INTERNAL_SERVER_ERROR_STATUS_CODE;

    if (errorMessagesToResponseStatusCodes[errorMessage]) {
        responseStatusCode = errorMessagesToResponseStatusCodes[errorMessage];
        responseData["message"] = errorMessage;
    }

    res.status(responseStatusCode).json(responseData);
};

module.exports = {
    INTERNAL_SERVER_ERROR_STATUS_CODE,
    UNAUTHORIZED_STATUS_CODE,
    FORBIDDEN_STATUS_CODE,
    RESOURCE_NOT_FOUND_STATUS_CODE,
    BAD_REQUEST_STATUS_CODE,
    RequestError,
    sendErrorResponse,
};
