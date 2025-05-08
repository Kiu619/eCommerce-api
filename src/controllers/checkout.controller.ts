import { OK } from "~/middlewares/success.response"
import { NextFunction, Request, Response } from 'express'
import CheckoutService from "~/services/checkout.service"

class CheckoutController {
  checkoutReview = async (req: Request, res: Response, next: NextFunction) => {
    return new OK({
      message: 'Add to cart successfully',
      metadata: await CheckoutService.checkoutReview(req.body)
    }).send(res)
  }
}


export default new CheckoutController()
