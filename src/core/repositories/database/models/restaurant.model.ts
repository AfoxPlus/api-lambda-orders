import mongoose, { Schema, Document, Types } from 'mongoose'
export interface RestaurantDocument extends Document {
    _id: Types.ObjectId,
    name: string,
}

const RestaurantSchema: Schema = new Schema({
    name: { type: String }
})

export const RestaurantModel = mongoose.models.Restaurant || mongoose.model<RestaurantDocument>('Restaurant', RestaurantSchema, 'Restaurant')