class apiError extends Error {

    constructor(statusCode, message) {

        super(message);

        this.success = false;

        this.statusCode = statusCode;

    }

}

module.exports = apiError;