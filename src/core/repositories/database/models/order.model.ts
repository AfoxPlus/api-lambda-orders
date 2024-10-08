import mongoose, { Schema, Document, Types } from 'mongoose'
import { RestaurantDocument } from '@core/repositories/database/models/restaurant.model'
import { CurrencyDocument } from '@core/repositories/database/models/currency.model'
import { OrderStateDocument } from '@core/repositories/database/models/order_state.model'

export interface OrderSubDetailDocument extends Document {
    productId: Types.ObjectId,
    title: string,
    quantity: Number
}

export interface OrderDetailDocument extends Document {
    productId: Types.ObjectId,
    title: string,
    description: string,
    unitPrice: Number,
    quantity: Number,
    subTotal: Number,
    productType?: String,
    subDetail?: OrderSubDetailDocument[],
    note?: string,
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
    number: string,
    userUUID: string,
    userFCMToken: string,
    client: ClientDocument,
    orderType: OrderTypeDocument,
    date: Date,
    delivery_type: string,
    currency: CurrencyDocument,
    restaurant: RestaurantDocument,
    total: Number,
    orderState: OrderStateDocument,
    isDone: Boolean,
    paymentMethod?: string,
    detail: OrderDetailDocument[]
}

const OrderSchema: Schema = new Schema({
    number: String,
    date: { type: Date, default: Date.now },
    total: Number,
    orderState: { type: mongoose.Schema.Types.ObjectId, ref: 'OrderState' },
    userUUID: { type: String },
    userFCMToken: { type: String },
    isDone: { type: Boolean, default: false },
    paymentMethod: { type: String },
    currency: { type: mongoose.Schema.Types.ObjectId, ref: 'Currency' },
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
    note: { type: String },
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
        productType: { type: String },
        unitPrice: Number,
        quantity: Number,
        subTotal: Number,
        note: { type: String },
        subDetail: [{
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
            title: { type: String },
            quantity: Number
        }]
    }]
})

export const OrderModel = mongoose.models.Order || mongoose.model<OrderDocument>('Order', OrderSchema, 'Order')
