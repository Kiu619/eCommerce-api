import { Schema, model, Types } from "mongoose"

const DOCUMENT_NAME = 'Cart'
const COLLECTION_NAME = 'Carts'

const cartSchema = new Schema({
  cart_state: {
    type: String, require: true,
    enum: ['active', 'completed', 'failed', 'pending'],
    default: 'active'
  },
  cart_products: { type: Array, default: [] },
  cart_count_product: { type: Number, default: 0 },
  cart_userId: { type: Schema.Types.ObjectId, ref: 'User' }
}, {
  collection: COLLECTION_NAME,
  timestamps: {
    createdAt: 'createdOn',
    updatedAt: 'modifiedOn'
  }
})

const cartModel = model(DOCUMENT_NAME, cartSchema)
export default cartModel
