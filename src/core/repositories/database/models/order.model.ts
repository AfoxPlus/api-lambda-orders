import mongoose, { Schema, Document, Types } from 'mongoose'
import { RestaurantDocument } from '@core/repositories/database/models/restaurant.model'
import { CurrencyDocument } from '@core/repositories/database/models/currency.model'

export interface OrderDetailDocument extends Document {
    productId: Types.ObjectId,
    title: string,
    description: string,
    unitPrice: Number,
    quantity: Number,
    subTotal: Number,
    currencyCode: string
}

export interface ClientDocument extends Document {
    uuid: string,
    name: string,
    cel: string,
    addressReference?: string
}

export interface OrderTypeDocument extends Document {
    _id: Types.ObjectId,
    code: string,
    title: string,
    description: string
}

export interface OrderDocument extends Document {
    _id: Types.ObjectId,
    number: String,
    userUUID: String,
    client: ClientDocument,
    orderType: OrderTypeDocument,
    date: Date,
    delivery_type: string,
    currency: CurrencyDocument,
    restaurant: RestaurantDocument,
    total: Number,
    state: String,
    isDone: Boolean,
    detail: OrderDetailDocument[]
}

const OrderSchema: Schema = new Schema({
    number: String,
    date: { type: Date, default: Date.now },
    total: Number,
    state: { type: String, default: 'Pendiente' },
    userUUID: { type: String },
    isDone: { type: Boolean, default: false },
    currency: { type: mongoose.Schema.Types.ObjectId, ref: 'Currency' },
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
    client: {
        name: { type: String },
        cel: { type: String },
        addressReference: { type: String }
    },
    orderType: {
        code: { type: String, required: true },
        title: { type: String, required: true },
        description: { type: String }
    },
    detail: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        title: { type: String },
        description: { type: String },
        unitPrice: Number,
        quantity: Number,
        subTotal: Number
    }]
})

export const OrderModel = mongoose.models.Order || mongoose.model<OrderDocument>('Order', OrderSchema, 'Order')
