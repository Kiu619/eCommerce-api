import { Types, SortOrder } from "mongoose"
import { product, electronic, clothing } from "../product.model"
import { getSelectData, unGetSelectData } from "~/utils"
import { NotFoundError } from "~/middlewares/error.response"

const queryProduct = async ({ query, limit, skip }: { query: any, limit: number, skip: number }) => {
  return await product.find(query)
    .populate('product_shop', 'name email -_id')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
}

const findAllDraftsForShop = async ({ query, limit, skip }: { query: any, limit: number, skip: number }) => {
  return await queryProduct({ query, limit, skip })
}

const findAllPublishedForShop = async ({ query, limit, skip }: { query: any, limit: number, skip: number }) => {
  return await queryProduct({ query, limit, skip })
}

const searchProductByUser = async ({ keySearch }: { keySearch: string }) => {
  const regexSearch = new RegExp(keySearch).source
  const result = await product.find(
    {
      isPublished: true,
      $text: { $search: regexSearch }
    }, {
      score: {$meta: 'textScore'}
    }).sort({score: {$meta: 'textScore'}}
  )

  return result
}

const findAllProducts = async ({limit, sort, page, filter, select}: {limit: number, sort: string, page: number, filter: any, select: any}) => {
  const skip = (page - 1) * limit
  const sortBy: { [key: string]: SortOrder } = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
  const products = await product.find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean()

  return products
}

const findProduct = async ({ product_id, unSelect }: { product_id: string, unSelect: string[] }) => {
  return await product.findById(product_id)
    .select(unGetSelectData(unSelect))
    .lean()
}


// --------------------------------------------------------
const updateProductById = async ({ productId, payload, model, isNew = true }: { productId: string | Types.ObjectId, payload: any, model: any, isNew: boolean }) => {
  return await model.findByIdAndUpdate(productId, payload, {
    new: isNew,
  })
}

// --------------------------------------------------------
const publishProductByShop = async ({ product_shop, product_id }: { product_shop: string, product_id: string }) => {
  const foundShop = await product.findOne({
    product_shop: new Types.ObjectId(product_shop),
    _id: new Types.ObjectId(product_id)
  }) 

  if (!foundShop) return null

  foundShop.isDraft = false
  foundShop.isPublished = true
  
  // modifiedCount is the number of documents that were updated 
  const { modifiedCount } = await foundShop.updateOne(foundShop)

  return modifiedCount
}

const unpublishProductByShop = async ({ product_shop, product_id }: { product_shop: string, product_id: string }) => {
  const foundShop = await product.findOne({
    product_shop: new Types.ObjectId(product_shop),
    _id: new Types.ObjectId(product_id)
  }) 

  if (!foundShop) return null

  foundShop.isDraft = true
  foundShop.isPublished = false
  
  // modifiedCount is the number of documents that were updated 
  const { modifiedCount } = await foundShop.updateOne(foundShop)

  return modifiedCount
}

const getProductById = async (productId: string) => {
  return await product.findById(productId)
}

const checkProductByServer = async (products: any[]) => {
  return await Promise.all(products.map(async (p) => {
    const foundProduct = await getProductById(p.productId)
    if (!foundProduct) {
      throw new NotFoundError('Product not found')
    }

    return  {
      price: foundProduct.product_price,
      quantity: p.quantity,
      productId: p.productId,
    }
  }))
}

export const productRepo = {
  findAllDraftsForShop,
  findAllPublishedForShop,
  publishProductByShop,
  unpublishProductByShop,
  searchProductByUser,
  findAllProducts,
  findProduct,
  updateProductById,
  getProductById,
  checkProductByServer,
}
