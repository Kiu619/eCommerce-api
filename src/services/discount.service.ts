import { Types } from "mongoose"
import { BadRequestError, NotFoundError } from "~/middlewares/error.response"
import discountModel from "~/models/discount.model"
import { discountRepo } from "~/models/repo/discount.repo"
import { productRepo } from "~/models/repo/product.repo"

class DiscountService {
  static async createDiscountCode(payload: any) {
    const {
      name,
      description,
      type,
      value,
      code,
      start_date,
      end_date,
      max_uses,
      uses_count,
      users_used,
      max_uses_per_user,
      min_order_value,
      shopId,
      is_active,
      applies_to,
      product_ids
    } = payload

    if (new Date() < new Date(start_date) || new Date() > new Date(end_date) || new Date(start_date) > new Date(end_date)) {
      throw new BadRequestError('Discount code is not valid 1')
    }

    if (uses_count >= max_uses) {
      throw new BadRequestError('Discount code is not valid 2')
    }

    if (users_used.length >= max_uses_per_user) {
      throw new BadRequestError('Discount code is not valid 3')
    }

    const foundDiscount = await discountModel.findOne({
      discount_code: code,
      discount_shopId: new Types.ObjectId(shopId)
    }).lean()

    if (foundDiscount && foundDiscount.discount_is_active) {
      throw new BadRequestError('Discount code is already exists')
    }

    const newDiscount = await discountModel.create({
      discount_name: name,
      discount_description: description,
      discount_type: type,
      discount_value: value,
      discount_code: code,
      discount_start_date: new Date(start_date),
      discount_end_date: new Date(end_date),
      discount_max_uses: max_uses,
      discount_uses_count: uses_count,
      discount_users_used: users_used,
      discount_max_uses_per_user: max_uses_per_user,
      discount_min_order_value: min_order_value || 0,
      discount_shopId: new Types.ObjectId(shopId),
      discount_is_active: is_active,
      discount_applies_to: applies_to,
      discount_product_ids: applies_to === 'all' ? [] : product_ids
    })

    return newDiscount
  }

  // static async updateDiscountCode(discountId: string, payload: any) {
  //   const {
  //     name,
  //     description,
  //     type,
  //     value,
  //     code,
  //     start_date,
  //     end_date,
  //     max_uses,
  //     uses_count,
  //     users_used,
  //     max_uses_per_user,
  //     min_order_value,
  //     shopId,
  //     is_active,
  //     applies_to,
  //     product_ids
  //   } = payload

  //   if (new Date() < new Date(start_date) || new Date() > new Date(end_date) || new Date(start_date) > new Date(end_date)) {
  //     throw new BadRequestError('Discount code is not valid')
  //   }

  //   if (uses_count >= max_uses) {
  //     throw new BadRequestError('Discount code is not valid')
  //   }

  //   if (users_used.length >= max_uses_per_user) {
  //     throw new BadRequestError('Discount code is not valid')
  //   }

  //   const foundDiscount = await discountModel.findOne({
  //     discount_code: code,
  //     discount_shopId: new Types.ObjectId(shopId)
  //   }).lean()

  //   if (!foundDiscount) {
  //     throw new BadRequestError('Discount code is not found')
  //   }

  //   const newDiscount = await discountModel.findOneAndUpdate({
  //     discount_code: code,
  //     discount_shopId: new Types.ObjectId(shopId)
  //   }, {

      
  // }

  static async getAllDiscountCodesWithProducts({code, shopId, userId, limit, page}: {code: string, shopId: string, userId?: string, limit: number, page: number}) {
    const foundDiscount = await discountModel.findOne({
      discount_code: code,
      discount_shopId: new Types.ObjectId(shopId)
    }).lean()

    console.log('code', code)
    console.log('shopId', shopId)

    if (!foundDiscount || !foundDiscount.discount_is_active) {
      throw new BadRequestError('Discount code is not valid 1')
    }

    const { discount_product_ids, discount_applies_to } = foundDiscount

    let products
    if (discount_applies_to === 'specific') {
      products = await productRepo.findAllProducts({
        limit,
        page,
        filter: { _id: { $in: discount_product_ids }, isPublished: true },
        sort: 'ctime',
        select: ['product_name']
      })
    }

    if (discount_applies_to === 'all') {
      products = await productRepo.findAllProducts({
        limit,
        page,
        filter: { product_shop: new Types.ObjectId(shopId), isPublished: true },
        sort: 'ctime',
        select: ['product_name']
      })
    }
      
    return products
  }

  static async getAllDiscountCodesByShop({limit, page, shopId}: {limit: number, page: number, shopId: string}) {
    const discounts = await discountRepo.findAllDiscountCodesUnSelect({
      limit,
      page,
      filter: { discount_shopId: new Types.ObjectId(shopId), discount_is_active: true },
      unSelect: ['__v', 'updatedAt'],
      model: discountModel,
      sort: 'ctime'
    })

    return discounts
  }

  static async getDiscountAmount({ codeId, userId, shopId, products}:{codeId: string, userId: string, shopId: string, products: any[]}) {
    const foundDiscount = await discountRepo.checkDiscountExits({
      model: discountModel,
      filter: {
        discount_code: codeId,
        discount_shopId: new Types.ObjectId(shopId)
      }
    })

    if (!foundDiscount) {
      throw new NotFoundError('Discount does not exist')
    }

    const {
      discount_is_active,
      discount_max_uses,
      discount_min_order_value,
      discount_max_uses_per_user,
      discount_users_used,
      discount_type,
      discount_value
    } = foundDiscount

    if (!discount_is_active) {
      throw new NotFoundError('Discount code is not valid')
    }

    if (!discount_max_uses) {
      throw new NotFoundError('Discount are out of stock')
    }

    if (new Date() < new Date(foundDiscount.discount_start_date) || new Date() > new Date(foundDiscount.discount_end_date)) {
      throw new NotFoundError('Discount code is not valid')
    }

    // check xem co xet gia tri toi thieu hay khong
    let totalOrder = 0 
    if (discount_min_order_value > 0) {
      totalOrder = products.reduce((acc, product) => acc + (product.price * product.quantity), 0)

      if (totalOrder < discount_min_order_value) {
        throw new NotFoundError(`Discount requires a minimum order value of ${discount_min_order_value}`)
      }
    }

    if (discount_max_uses_per_user > 0) {
      const userUsed = discount_users_used.find((user: any) => user.userId === userId)

      if (userUsed && userUsed.length >= discount_max_uses_per_user) {
        throw new NotFoundError('Discount code is not valid')
      }
    }

    // check xem discount la fixed hay percentage
    const amount = discount_type === 'fixed_amount' ? discount_value : totalOrder * (discount_value / 100)

    return {
      totalOrder,
      discount: amount,
      totalPrice: totalOrder - amount
    }
  }

  static async deleteDiscountCode({ codeId, shopId }: { codeId: string, shopId: string }) {
    const deleted = await discountModel.findOneAndDelete({
      discount_code: codeId,
      discount_shopId: new Types.ObjectId(shopId)
    })

    return deleted
  }

  static async cancelDiscountCode({ codeId, shopId, userId}: { codeId: string, shopId: string, userId: string }) {
    const foundDiscount = await discountRepo.checkDiscountExits({
      model: discountModel,
      filter: {
        discount_code: codeId,
        discount_shopId: new Types.ObjectId(shopId)
      }
    })

    if (!foundDiscount) {
      throw new NotFoundError('Discount code is not found')
    }

    const userUsed = foundDiscount.discount_users_used.find((user: any) => user.userId === userId)

    if (!userUsed) {
      throw new NotFoundError('Discount code is not found')
    }

    const result = await discountModel.findByIdAndUpdate(foundDiscount._id, {
      $pull: {
        discount_users_used: { userId }
      },
      $inc: {
        discount_uses_count: -1,
        discount_max_uses: 1
      }
    })

    return result
  }
}

export default DiscountService
