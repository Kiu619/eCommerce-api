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

// trừ đi số đạt hàng ở trong kho
const reservationInventory = async ({ productId, quantity, cartId }: { productId: string, quantity: number, cartId: string }) => {
  const query = {
    inven_productId: new Types.ObjectId(productId),
    inven_stock: { $gte: quantity },
  }, updateSet = {
    $inc: {
      inven_stock: -quantity,
    },
    $push: {
      inven_reservations: {
        quantity,
        cartId,
        createAt: new Date(),
      }
    }
  }, options = { new: true, upsert: true }

  return await inventoryModel.updateOne(query, updateSet, options)
}

export const inventoryRepo = {
  insertInventory, reservationInventory
}
