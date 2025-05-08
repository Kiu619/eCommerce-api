import CartService from '~/services/cart.service'
import { NextFunction, Request, Response } from 'express'
import { CREATED, OK } from '~/middlewares/success.response'

class CartController {
  
  addToCart = async (req: Request, res: Response, next: NextFunction) => {
    return new CREATED({
      message: 'Add to cart successfully',
      metadata: await CartService.addToCart({
        userId: (req as any).user.userId,
        product: req.body
      })
    }).send(res)
  }

  updateCart = async (req: Request, res: Response, next: NextFunction) => {
    return new CREATED({
      message: 'Update cart successfully',
      metadata: await CartService.addToCartV2({
        userId: (req as any).user.userId,
        product: req.body
      })
    }).send(res)
  }

  delete = async (req: Request, res: Response, next: NextFunction) => {
    return new OK({
      message: 'Delete cart successfully',
      metadata: await CartService.deleteUserCart({
        userId: (req as any).user.userId,
        productId: req.body
      })
    }).send(res)
  }

  listToCart = async (req: Request, res: Response, next: NextFunction) => {
    return new OK({
      message: 'List cart successfully',
      metadata: await CartService.getListUserCart({
        userId: (req as any).user.userId
      })
    }).send(res)
  }
}

export default new CartController()

