import { NotFoundError } from '~/middlewares/error.response'
import cartModel from '~/models/cart.model'
import { productRepo } from '~/models/repo/product.repo'

class CartService {

  static async createUserCart({ userId, product }: { userId: string, product: any }) {
    const query = { cart_userId: userId, cart_state: 'active' },
      updateOrInsert = {
        $addToSet: {
          cart_products: product
        }
      },
      options = { upsert: true, new: true }

    return await cartModel.findOneAndUpdate(query, updateOrInsert, options)

  }

  static async updateUserCartQuantity({ userId, product }: { userId: string, product: any }) {
    const { productId, quantity } = product

    const query = {
      cart_userId: userId,
      cart_state: 'active',
      'cart_products.productId': productId
    }, updateSet = {
      $inc: {
        'cart_products.$.quantity': quantity
      }
    }, options = { upsert: true, new: true }

    return await cartModel.findOneAndUpdate(query, updateSet, options)
  }

  static async addToCart({ userId, product }: { userId: string, product: {} }) {
    // check if cart is exist
    const cart = await cartModel.findOne({ cart_userId: userId, cart_state: 'active' })
    if (!cart) {
      // create new cart
      return await this.createUserCart({ userId, product })
    }
    // if cart is exist, but product is not exist in cart
    if (!cart.cart_products.length) {
      cart.cart_products = [product]
      return await cart.save()
    }

    // if cart is exist, and product is exist in cart
    return await this.updateUserCartQuantity({ userId, product })
  }

  // update Cart
  /*
     shop_order_ids: [
     {  shopId,
       item_products: [
        {
          quantity,
          price,
          shopId,
          old_quantity,
          productId
          },
          version
    ]
    
   */

  static async addToCartV2({ userId, product }: { userId: string, product: {} }) {
    const shop_order_ids: {
      shopId: string,
      item_products: {
        quantity: number,
        price: number,
        shopId: string,
        productId: string,
        old_quantity: number
      }[]
    }[] = []; // Define shop_order_ids
    const { productId, quantity, old_quantity } = shop_order_ids[0]?.item_products[0]

    const foundProduct = await productRepo.getProductById(productId)

    if (!foundProduct) {
      throw new NotFoundError('Product not found')
    }

    if (foundProduct.product_shop.toString() !== shop_order_ids[0].shopId) {
      throw new NotFoundError('Product not found in this shop')
    }

    if (quantity == 0) {
      // delete
    }

    return await CartService.updateUserCartQuantity({
      userId,
      product: {
        productId,
        quantity: quantity - old_quantity
      }
    })
  }

  static async deleteUserCart({
    userId,
    productId
  }: {
    userId: string,
    productId: string
  }) {
    const query = { cart_userId: userId, cart_state: 'active' },
      updateSet = {
        $pull: {
          cart_products: { productId }
        }
      }

    const deleteCart = await cartModel.updateOne(query, updateSet)

    return deleteCart
  }

  static async getListUserCart({ userId }: { userId: string }) {
    return await cartModel.findOne({ cart_userId: userId, cart_state: 'active' }).lean()
  }
}

export default CartService
