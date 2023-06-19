import mongoose, { Schema, Document, Types } from 'mongoose'
import { RestaurantDocument } from './restaurant.model'

export interface OrderDetailDocument extends Document {
    productId: Types.ObjectId,
    description: string,
    unitPrice: Number,
    quantity: Number,
    subTotal: Number,
    currencyCode: string
}

export interface ClientDocument extends Document {
    uuid: string,
    name: string,
    cel: string
}

export interface OrderDocument extends Document {
    _id: Types.ObjectId,
    number: String,
    user_uuid: String,
    client: ClientDocument,
    date: Date,
    delivery_type: string,
    restaurant: RestaurantDocument,
    total: Number,
    state: String,
    is_done: Boolean,
    detail: OrderDetailDocument[]
}

const OrderSchema: Schema = new Schema({
    number: String,
    date: { type: Date },
    delivery_type: String,
    total: Number,
    state: { type: String, default: 'Pendiente' },
    user_uuid: { type: String },
    is_done: { type: Boolean, default: false },
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
    client: {
        name: { type: String },
        cel: { type: String }
    },
    detail: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        description: { type: String },
        unitPrice: Number,
        quantity: Number,
        subTotal: Number,
        currencyCode: { type: String }
    }]
})

export const OrderModel = mongoose.models.Order || mongoose.model<OrderDocument>('Order', OrderSchema, 'Order')
