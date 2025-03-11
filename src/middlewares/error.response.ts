import { reasonPhrases } from "~/utils/reasonPhrases"
import { statusCodes } from "~/utils/statusCodes"

class ErrorResponse extends Error {
  constructor(message: string, public statusCode: number) {
    super(message)
    this.statusCode = statusCode
  }
}

class ConfictRequestError extends ErrorResponse {
  constructor (message = reasonPhrases.CONFLICT, statusCode = statusCodes.FORBIDDEN) {
    super(message, statusCode)
  }
}

class BadRequestError extends ErrorResponse {
    constructor (message = reasonPhrases.BAD_REQUEST, statusCode = statusCodes.FORBIDDEN) {
    super(message, statusCode)
  }
}

class AuthFailureError extends ErrorResponse {  
  constructor (message = reasonPhrases.UNAUTHORIZED, statusCode = statusCodes.UNAUTHORIZED) {
    super(message, statusCode)
  }
}

class NotFoundError extends ErrorResponse {
  constructor (message = reasonPhrases.NOT_FOUND, statusCode = statusCodes.NOT_FOUND) {
    super(message, statusCode)
  }
}


export {
  ConfictRequestError,
  BadRequestError,
  AuthFailureError,
  NotFoundError
}
