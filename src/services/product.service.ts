import { Types } from 'mongoose'
import { BadRequestError } from '~/middlewares/error.response'
import { product, clothing, electronic } from '~/models/product.model'
import { productRepo } from '~/models/repo/product.repo'
import { removeUndefinedObject, updateNestedObjectParser } from '~/utils'

interface ProductType {
  product_name: string
  product_thumb: string
  product_description: string
  product_quantity: number
  product_price: number
  product_type: string
  product_shop: string
  product_attributes: any
}

class ProductFactory {

  static async createProduct(type: string, payload: ProductType) {
    switch (type) {
      case 'Clothing':
        return new Clothing(payload).createProduct()
      case 'Electronic':
        return new Electronic(payload).createProduct()
      default:
        throw new BadRequestError('Invalid product type')
    }
  }

  static async updateProduct(type: string, product_id: string, payload: ProductType) {
    switch (type) {
      case 'Clothing':
        return new Clothing(payload).updateProduct(product_id)
      case 'Electronic':
        return new Electronic(payload).updateProduct(product_id)
      default:
        throw new BadRequestError('Invalid product type')
    }
  }

  // GET
  static async findAllDraftsForShop({ product_shop, limit = 50, skip = 0 }: { product_shop: string, limit?: number, skip?: number }) {
    const query = { product_shop, isDraft: true }
    return await productRepo.findAllDraftsForShop({ query, limit, skip })
  }

  static async findAllPublishedForShop({ product_shop, limit = 50, skip = 0 }: { product_shop: string, limit?: number, skip?: number }) {
    const query = { product_shop, isPublished: true }
    return await productRepo.findAllPublishedForShop({ query, limit, skip })
  }

  static async getListSearchProduct({ keySearch }: { keySearch: string }) {
    return await productRepo.searchProductByUser({ keySearch })
  }

  static async findAllProducts({ limit = 50, sort = 'ctime', page = 1, filter = { isPublished: true }
  }: { limit: number, sort: string, page: number, filter: any }) {
    return await productRepo.findAllProducts({ limit, sort, page, filter, select: ['product_name', 'product_price', 'product_shop', 'product_thumb'] })
  }

  static async findProduct({ product_id }: { product_id: string }) {
    return await productRepo.findProduct({ product_id, unSelect: ['__v'] })
  }

  // PUT ----------------------------------
  static async publishProductByShop({ product_shop, product_id }: { product_shop: string, product_id: string }) {
    return await productRepo.publishProductByShop({ product_shop, product_id })
  }

  static async unpublishProductByShop({ product_shop, product_id }: { product_shop: string, product_id: string }) {
    return await productRepo.unpublishProductByShop({ product_shop, product_id })
  }
}

class Product {
  product_name: string
  product_thumb: string
  product_description: string
  product_quantity: number
  product_price: number
  product_type: string
  product_shop: string
  product_attributes: any

  constructor({
    product_name,
    product_thumb,
    product_description,
    product_quantity,
    product_price,
    product_type,
    product_shop,
    product_attributes,
  }: ProductType) {
    this.product_name = product_name
    this.product_thumb = product_thumb
    this.product_description = product_description
    this.product_quantity = product_quantity
    this.product_price = product_price
    this.product_type = product_type
    this.product_shop = product_shop
    this.product_attributes = product_attributes
  }

  async createProduct(productId: string | Types.ObjectId) {
    return await product.create({
      ...this,
      _id: productId
    })
  }

  async updateProduct(productId: string | Types.ObjectId, payload: ProductType) {
    return await productRepo.updateProductById({ productId, payload, model: product, isNew: true })
  }
}

class Clothing extends Product {

  async createProduct() {
    const newClothing = await clothing.create({
      ...this.product_attributes,
      product_shop: this.product_shop
    })
    if (!newClothing) throw new BadRequestError('Create new clothing error')

    const newProduct = await super.createProduct(newClothing._id)
    if (!newProduct) throw new BadRequestError('Create new product error')

    return newProduct
  }


  async updateProduct(productId: string) {
    const updateNest = updateNestedObjectParser(this)
    const objectParams = removeUndefinedObject(updateNest)
    if (objectParams.product_attributes) {
      await productRepo.updateProductById({ productId, payload: objectParams, model: clothing, isNew: true })
    }
    const updateProduct = await super.updateProduct(productId, objectParams)
    return updateProduct
  }
}

class Electronic extends Product {

  async createProduct() {
    const newElectronic = await electronic.create({
      ...this.product_attributes,
      product_shop: this.product_shop
    })
    if (!newElectronic) throw new BadRequestError('Create new electronic error')

    const newProduct = await super.createProduct(newElectronic._id)
    if (!newProduct) throw new BadRequestError('Create new product error')

    return newProduct
  }

  async updateProduct(productId: string) {
    const updateNest = updateNestedObjectParser(this)
    const objectParams = removeUndefinedObject(updateNest)
    if (objectParams.product_attributes) {
      await productRepo.updateProductById({ productId, payload: objectParams, model: electronic, isNew: true })
    }
    const updateProduct = await super.updateProduct(productId, objectParams)
    return updateProduct
  }
}

export default ProductFactory
