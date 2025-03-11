import { Request, Response, NextFunction } from 'express'

const asyncHandler = (func: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    func(req, res, next).catch(next)
  }
}

export default asyncHandler
