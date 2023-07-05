import mongoose, { Schema, Document, Types } from 'mongoose'

export interface OrderStateDocument extends Document {
    _id: Types.ObjectId,
    code: string,
    name: string
}

const OrderStateSchema: Schema = new Schema({
    code: { type: String },
    name: { type: String }
})

export const OrderStateModel = mongoose.models.OrderState || mongoose.model<OrderStateDocument>('OrderState', OrderStateSchema, 'OrderState')