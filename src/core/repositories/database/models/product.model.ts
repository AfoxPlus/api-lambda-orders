import mongoose, { Schema, Document, Types } from 'mongoose'

export interface ProductDocument extends Document {
    _id: Types.ObjectId
    name: string,
    description: string,
    imageUrl: string,
    stock: Number,
    price: Number,
    showInApp: Boolean
}

const ProductSchema: Schema = new Schema({
    name: { type: String, require: true },
    description: String,
    imageUrl: String,
    stock: Number,
    price: { type: Number, require: true },
    showInApp: { type: Boolean, default: false }
})

export const ProductModel = mongoose.models.Product || mongoose.model<ProductDocument>('Product', ProductSchema, 'Product')