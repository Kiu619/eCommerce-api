import DiscountService from '~/services/discount.service'
import { NextFunction, Request, Response } from 'express'
import { CREATED, OK } from '~/middlewares/success.response'

class DiscountController {

  createDiscountCode = async (req: Request, res: Response, next: NextFunction) => {
    return new CREATED({
      message: 'Create discount code successfully',
      metadata: await DiscountService.createDiscountCode({
        ...req.body,
        shopId: (req as any).user.userId
      })
    }).send(res)
  }

  getAllDiscountCodes = async (req: Request, res: Response, next: NextFunction) => {
    return new OK({
      message: 'Get list discount codes success',
      metadata: await DiscountService.getAllDiscountCodesByShop({
        limit: Number(req.query.limit),
        page: Number(req.query.page),
        shopId: String((req as any).user.userId)
      })
    }).send(res)
  }

  getDiscountAmount = async (req: Request, res: Response, next: NextFunction) => {
    return new OK({
      message: 'Get list discount codes success',
      metadata: await DiscountService.getDiscountAmount({
        ...req.body,
      })
    }).send(res)
  }

  getAllDiscountCodesWithProducts = async (req: Request, res: Response, next: NextFunction) => {
    console.log('req param', req)
    return new OK({
      message: 'Get list discount codes success',
      metadata: await DiscountService.getAllDiscountCodesWithProducts({
        code: String(req.query.code),
        shopId: String(req.query.shopId),
        // userId: (req as any).user.userId,
        limit: Number(req.query.limit),
        page: Number(req.query.page)
      })
    }).send(res)
  }

}

export default new DiscountController()

