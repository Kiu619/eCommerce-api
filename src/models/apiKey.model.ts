import mongoose from 'mongoose'

const DOCUMENT_NAME = 'ApiKeys'
const COLLECTION_NAME = 'ApiKeys'

// Declare the Schema of the Mongo model
const apiKeySchema = new mongoose.Schema({
    key: {
        type: String,
        required: true,
        unique: true,
    },
    status: {
        type: Boolean,
        default: true,
        required: true,
    },
    permissions: {
        type: [String],
        required: true,
        enum: ['0000', '1111', '2222'],
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME,
})

//Export the model
const apiKeyModel = mongoose.model(DOCUMENT_NAME, apiKeySchema)
export default apiKeyModel
