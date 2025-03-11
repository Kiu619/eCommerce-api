import { Schema, model, Types } from "mongoose";

const DOCUMENT_NAME = 'Key'
const COLLECTION_NAME = 'Keys'


const keyTokenSchema = new Schema({
    user: {
        type: Types.ObjectId,
        required: true,
        ref: 'Shop'
    },
    publicKey: {
        type: String,
        required: true
    },
    privateKey: {
        type: String,
        required: true
    },
    refreshTokensUsed: {
        type: Array,
        default: []
    },
    refreshToken: {
        type: String,
        required: true
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})

const keyTokenModel = model(DOCUMENT_NAME, keyTokenSchema)
export default keyTokenModel
