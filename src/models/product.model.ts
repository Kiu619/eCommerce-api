import { Schema, model } from "mongoose"
import slugify from "slugify"
const DOCUMENT_NAME = 'Product'
const COLLECTION_NAME = 'Products'

const productSchema = new Schema({
    product_name: { type: String, required: true },
    product_thumb: { type: String, required: true },
    product_description: { type: String },
    product_slug: { type: String },
    product_quantity: { type: Number, required: true },
    product_price: { type: Number, required: true },
    product_type: { type: String, required: true, enum: ['Electronic', 'Clothing', 'Furniture'] },
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop', required: true },
    product_attributes: { type: Schema.Types.Mixed, required: true },
    product_ratingAverage: { 
      type: Number, 
      default: 4.5, 
      min: [1, 'Rating must be above 1.0'], 
      max: [5, 'Rating must be above 5.0'], 
      set: (val: number) => Math.round(val * 10) / 10 
    },
    product_variations: { type: Array, default: [] },
    isDraft: { 
      type: Boolean, 
      required: true, 
      default: true, 
      index: true, 
      select: false 
    },
    isPublished: { 
      type: Boolean, 
      required: true, 
      default: false, 
      index: true,
      select: false 
    }, 
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})

// create index for search
productSchema.index({ product_name: 'text', product_description: 'text' })
// Document middleware: runs before .save() and .create()...
productSchema.pre('save', function (next) {
    this.product_slug = slugify(this.product_name, { lower: true, strict: true })
    next()
})

// 
const clothingSchema = new Schema({
    brand: { type: String, required: true },
    size: { type: String },
    material: { type: String },
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop', required: true },
}, {
    timestamps: true,
    collection: 'clothes'
})

const electronicSchema = new Schema({
    brand: { type: String, required: true },
    model: { type: String},
    color: { type: String },
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop', required: true },
}, {
    timestamps: true,
    collection: 'electronics'
})

// const furnitureSchema = new Schema({
//     brand: { type: String, required: true },
//     size: { type: String},
//     size_guide: { type: String },
//     size_chart: { type: String },
// }, {
//     timestamps: true,
//     collection: 'furnitures'
// })

const product = model(DOCUMENT_NAME, productSchema)
const clothing = model('Clothing', clothingSchema)
const electronic = model('Electronic', electronicSchema)
// const furniture = model('Furniture', furnitureSchema)

export { product, clothing, electronic }



