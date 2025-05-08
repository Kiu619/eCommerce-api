/*
    {
        cartId,
        userId,
        shop_order_ids: [
            {
                shopId,
                shop_discounts: [
                {
                    shopId,
                    discountId,  
                    codeId
                ],
                item_products: [
                {
                    quantity,
                    price,
                    productId
                }
                ]
            }
        ]
}
*/
import { BadRequestError, NotFoundError } from "~/middlewares/error.response"
import { cartRepo } from "~/models/repo/cart.repo"
import { productRepo } from "~/models/repo/product.repo"
import DiscountService from "./discount.service"
import redisService from "./redis.service"
import orderModel from "~/models/order.model"

interface CheckoutReview {
  cartId: string
  userId: string
  shop_order_ids: {
    shopId: string
    shop_discounts: {
      shopId: string
      discountId: string
      codeId: string
    }[]
    item_products: {
        quantity: number
        price: number
        productId: string
    }[]
  }[]
}        

class CheckoutService {

  static async checkoutReview({cartId, userId, shop_order_ids}: CheckoutReview ) {
    const foundCart = await cartRepo.findCartById(cartId)
    if (!foundCart) {
      throw new BadRequestError('Cart not found')
    }

    const checkout_order = {
      totalPrice: 0,
      feeShip: 0,
      totalDiscount: 0,
      totalCheckout: 0,
    }

    const shop_order_ids_new = []

    // tinh tong tien bill
    for (let i = 0; i< shop_order_ids.length; i++) {
      const { shopId, shop_discounts = [], item_products =[] } = shop_order_ids[i]
      const checkProductByServer = await productRepo.checkProductByServer(item_products)

      if (!checkProductByServer[0]) {
        throw new BadRequestError('Something went wrong')
      }

      const checkoutPrice = checkProductByServer.reduce((total, item) => {
        return total + (item.price * item.quantity)
      }, 0)

      // tong tien truoc khi xu lyu
      checkout_order.totalPrice += checkoutPrice

      const itemCheckout = {
        shopId,
        shop_discounts,
        priceRaw: checkoutPrice,
        priceAppliedCheckout: checkoutPrice,
        item_products: checkProductByServer
      }

      // neu shop_discount ton tai > 0, check xem co hop le khong
      if (shop_discounts.length > 0) {
        // gia su chi co mot discount
        // get discount amount
        const {totalPrice = 0, discount = 0} = await DiscountService.getDiscountAmount({
          codeId: shop_discounts[0].codeId,
          userId,
          shopId,
          products: checkProductByServer
        })
        // tong cong discount giam gia
        checkout_order.totalDiscount += discount

        if (discount > 0) {
          itemCheckout.priceAppliedCheckout = checkoutPrice - discount
        }

      }
      // tong thanh toan cuoi cung
      checkout_order.totalCheckout += itemCheckout.priceAppliedCheckout
      shop_order_ids_new.push(itemCheckout)
    }

    return {
      shop_order_ids,
      shop_order_ids_new,
      checkout_order
    }
  }


  // order
  static async orderByUser({shop_order_ids, cartId, userId, user_address = {}, user_payment = {}}: {shop_order_ids: any[], cartId: string, userId: string, user_address?: any, user_payment?: any}) {
    const  { shop_order_ids_new, checkout_order } = await CheckoutService.checkoutReview({cartId, userId, shop_order_ids})

    // check lai mot lan nua xem vuot ton khi hay khong 

    const products = shop_order_ids_new.flatMap(order => order.item_products)

    const acquireProduct = []
    for (let i = 0; i < products.length; i++) {
      const { productId, quantity } = products[i]
      const keyLock = await redisService.acquireLock(productId, quantity, cartId)
      acquireProduct.push(keyLock ? true : false)
      if (keyLock) {
        // release lock
        await redisService.releaseLock(keyLock)
      }
    }
    // check xem co kho khong
    if (acquireProduct.includes(false)) {
      throw new BadRequestError('Some product is be modified, please check your cart again')
    }

    const newOrder = await orderModel.create({
      order_userId: userId,
      order_checkout: checkout_order,
      order_shipping: user_address,
      order_payment: user_payment,
      order_products: products
    })

    // truong hop: neu insert thanh cong, thi se update lai cart (remove product trong cart)
    if (newOrder) {
      await cartRepo.updateCart(cartId, {
        $pull: {
          cart_products: { productId: { $in: products.map(item => item.productId) } }
        }
      })
    }
    return newOrder

  }

  static async getOrdersByUser() {

  }

  static async getOneOrderByUser() {

  }

  static async cancelOrderByUser() {

  }

  static async updateOrderStatusByShopOrAdmin() {

  }

}


export default CheckoutService
