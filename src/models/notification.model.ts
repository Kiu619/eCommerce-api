import { Schema, model, Types } from "mongoose"

const DOCUMENT_NAME = 'Notification'
const COLLECTION_NAME = 'Notifications'

// ORDER--001: order success
// ORDER--002: order fail
// PROMOTION--001: new promotion
// SHOP--001: new product by User follow shop
const notificationSchema = new Schema({
    noti_type: { type: String, enum: ['ORDER-001', 'ORDER-002', 'PROMOTION-001', 'SHOP-001'], required: true },
    noti_senderId: { type: Schema.Types.ObjectId, required: true },
    noti_receiverId: { type: String, required: true },
    noti_content: { type: String, required: true },
    noti_options: { type: Object, default: {} },
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})

const notificationModel = model(DOCUMENT_NAME, notificationSchema)
export default notificationModel
