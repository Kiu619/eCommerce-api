import { Schema, model, Types } from "mongoose"

const DOCUMENT_NAME = 'Order'
const COLLECTION_NAME = 'Orders'

const orderSchema = new Schema({
    order_userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    order_checkout: { type: Object, default: {} },
    /*
        order_checkout: {
            totalPrice,
            totalApplyDiscount,
            feeShip,
    */
    order_shipping: { type: Object, default: {} },
    /*
     street, city, state, country
     */
    order_payment: { type: Object, default: {} },
    order_products: { type: Array, required: true },
    order_trackingNumber: { type: String, default: '#000000' },
    order_status: { type: String, enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'], default: 'pending' },    
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})

const orderModel = model(DOCUMENT_NAME, orderSchema)
export default orderModel
