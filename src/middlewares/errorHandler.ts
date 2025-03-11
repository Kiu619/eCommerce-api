import { Request, Response, NextFunction, ErrorRequestHandler } from 'express'

interface ErrorWithStatusCode extends Error {
  statusCode?: number;
}

export const notFoundError = (req: Request, res: Response, next: NextFunction) => {
  const error: ErrorWithStatusCode = new Error('Not Found')
  error.statusCode = 404
  next(error)
}

export const errorHandler: ErrorRequestHandler = (err: ErrorWithStatusCode, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500
  res.status(statusCode).json({
    status: 'error',
    code: statusCode,
    stack: err.stack,
    message: err.message || 'Internal Server Error'
  })
}
