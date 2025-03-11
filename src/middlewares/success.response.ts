import { statusCodes } from "~/utils/statusCodes"
import { reasonPhrases } from "~/utils/reasonPhrases"
import { Response } from "express"

class SuccessResponse {
  constructor(
    public message: string,
    public statusCode: number = statusCodes.OK,
    public reasonStatusCode: string = reasonPhrases.OK,
    public metadata: any = {}
  ) {
    this.message = !message ? reasonPhrases.OK : message
    this.statusCode = statusCode
    this.metadata = metadata
  }

  send(res: Response, headers = {}) {
    return res.status(this.statusCode).json(this)
  }
}

class OK extends SuccessResponse {
  constructor({message, metadata}: {message: string, metadata: any}) {
    super(message, statusCodes.OK, reasonPhrases.OK, metadata)
  }
}

class CREATED extends SuccessResponse {
  constructor({message, metadata}: {message: string, metadata: any}) {
    super(message, statusCodes.CREATED, reasonPhrases.CREATED, metadata)
  }
}

export {
  SuccessResponse,
  OK,
  CREATED
}
