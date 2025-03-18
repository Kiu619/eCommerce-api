import inventoryModel from "~/models/inventory.model"
import { Types } from "mongoose"

const insertInventory = async ({
  productId,
  shopId,
  stock,
  location = 'unKnow'
}: {
  productId: Types.ObjectId,
  shopId: Types.ObjectId,
  stock: number,
  location?: string
}) => {
  return await inventoryModel.create({
    inven_productId: productId,
    inven_shopId: shopId,
    inven_stock: stock,
    inven_location: location
  })
}

export const inventoryRepo = {
  insertInventory
}
