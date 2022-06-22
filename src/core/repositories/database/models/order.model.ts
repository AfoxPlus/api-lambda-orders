import mongoose, { Schema, Document, Types } from 'mongoose'

export interface OrderDetailDocument extends Document {
    productId: Types.ObjectId,
    description: string,
    unitPrice: Number,
    quantity: Number,
    subTotal: Number,
    currencyCode: string
}

export interface ClientDocument extends Document {
    name: string,
    cel: string
}

export interface OrderDocument extends Document {
    _id: Types.ObjectId,
    client: ClientDocument,
    date: Date,
    tableNumber: string,
    restaurantId: Types.ObjectId,
    total: Number,
    detail: OrderDetailDocument[]
}

const OrderSchema: Schema = new Schema({
    date: { type: Date },
    tableNumber: String,
    total: Number,
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
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