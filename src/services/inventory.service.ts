import inventoryModel from "~/models/inventory.model"
import { productRepo } from "~/models/repo/product.repo"
import { NotFoundError, BadRequestError } from "~/middlewares/error.response"

class InventoryService {

  static async addStockToInventory({
    stock,
    productId,
    shopId,
    location,
  }: {
    stock: number
    productId: string
    shopId: string
    location: string
  }) {
    const foundProduct = await productRepo.getProductById(productId)
    if (!foundProduct) {
      throw new NotFoundError('Product not found')
    }

    const query = { inven_shopId: shopId, inven_productId: productId }
    const update = { $inc: { inven_stock: stock }, $set: { inven_location: location }}
    const options = { upsert: true, new: true }

    return await inventoryModel.findOneAndUpdate(query, update, options)
  }
  
  
}

export default InventoryService 
