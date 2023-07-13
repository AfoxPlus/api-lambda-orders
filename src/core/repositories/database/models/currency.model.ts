import mongoose, { Schema, Document, Types } from 'mongoose'

export interface CurrencyDocument extends Document {
    _id: Types.ObjectId,
    code: string,
    value: string
}

const CurrencySchema: Schema = new Schema({
    code: { type: String },
    value: { type: String }
})

export const CurrencyModel = mongoose.models.Currency || mongoose.model<CurrencyDocument>('Currency', CurrencySchema, 'Currency')