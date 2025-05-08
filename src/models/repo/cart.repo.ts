import { Types } from "mongoose"
import cartModel from "../cart.model"

const findCartById = async (cartId: string) => {
  return await cartModel.findById(new Types.ObjectId(cartId)).lean()
}

const updateCart = async (cartId: string, update: any) => {
  return await cartModel.findByIdAndUpdate(new Types.ObjectId(cartId), update, { new: true })
}

export const cartRepo = {
  findCartById,
  updateCart
}
