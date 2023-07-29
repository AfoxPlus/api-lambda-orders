import { Order } from "@core/entities/Order";
import { OrderStatus } from "@core/entities/OrderStatus";
import { OrderRepository } from "@core/repositories/OrderRepository";
import { OrderDetailDocument, OrderDocument, OrderModel, OrderSubDetailDocument } from "@core/repositories/database/models/order.model";
import { RestaurantModel } from "@core/repositories/database/models/restaurant.model";
import { CurrencyModel } from "@core/repositories/database/models/currency.model";
import moment from 'moment';
import { OrderStateDocument, OrderStateModel } from "@core/repositories/database/models/order_state.model";
import { OrderState } from "@core/entities/OrderState";
import { Types } from "mongoose";

export class MongoDBOrderRepository implements OrderRepository {

    updateOrderState = async (orderId: string, newOrderStateId: string): Promise<OrderStatus> => {
        try {
            const updateObject = { orderState: newOrderStateId }
            const result = await OrderModel.findOneAndUpdate({ _id: new Types.ObjectId(orderId) }, updateObject, { new: true })
                .populate({ path: 'restaurant', model: RestaurantModel })
                .populate({ path: 'currency', model: CurrencyModel })
                .populate({ path: 'orderState', model: OrderStateModel }).exec()
            if (result == null) {
                return null
            }
            return this.documentToOrder(result)
        } catch (err) {
            throw new Error("Internal Error")
        }
    }

    getOrderStates = async (): Promise<OrderState[]> => {
        try {
            const result: OrderStateDocument[] = await OrderStateModel.find()
            return result.map(document => ({
                id: document._id.toString(),
                code: document.code,
                name: document.name
            }))

        } catch (err) {
            throw new Error("Internal Error")
        }
    }

    findOne = async (orderId: string): Promise<OrderStatus> => {
        try {
            const result = await OrderModel.findById(orderId)
                .populate({ path: 'restaurant', model: RestaurantModel })
                .populate({ path: 'currency', model: CurrencyModel })
                .populate({ path: 'orderState', model: OrderStateModel })
            return this.documentToOrder(result)
        } catch (err) {
            throw new Error("Internal Error")
        }
    }

    status = async (userUUID: string): Promise<OrderStatus[]> => {
        try {
            const result: OrderDocument[] = await OrderModel.find({ isDone: false }).where('userUUID').equals(userUUID)
                .populate({ path: 'restaurant', model: RestaurantModel })
                .populate({ path: 'currency', model: CurrencyModel })
                .populate({ path: 'orderState', model: OrderStateModel })
            return result.map((document) => this.documentToOrder(document))
        } catch (err) {

            throw new Error("Internal Error")
        }
    }

    send = async (order: Order, restaurantCode: string): Promise<OrderStatus> => {
        try {
            const orderState: OrderStateDocument = await OrderStateModel.findOne().where('code').equals("TODO")
            const currentNumber: number = await OrderModel.countDocuments({ restaurant: restaurantCode })
            order.number = this.paddy((currentNumber + 1), 6).toString()
            order.orderState = orderState._id.toString()
            let result: OrderDocument = await OrderModel.create(order)
            result = await result.populate({ path: 'restaurant', model: RestaurantModel })
            result = await result.populate({ path: 'currency', model: CurrencyModel })
            result = await result.populate({ path: 'orderState', model: OrderStateModel })
            return this.documentToOrder(result)
        } catch (err) {
            throw new Error("Internal Error")
        }
    }

    documentToOrder(result: OrderDocument): OrderStatus {
        return {
            id: result._id.toString(),
            number: `#${result.number}`,
            date: (moment(result.date)).utcOffset(-5).format('DD MMM YYYY, hh:mm A'),
            state: result.orderState.name,
            state_code: result.orderState.code,
            restaurant: result.restaurant.name,
            order_type: {
                code: result.orderType.code,
                title: result.orderType.title,
                description: result.orderType.description
            },
            total: `${result.currency.value} ${result.total.toFixed(2)}`,
            client: {
                name: result.client.name,
                cel: result.client.cel,
                address_reference: result.client.addressReference
            },
            detail: this.documentDetailToOrderDetail(result.detail, result.currency.value)
        }
    }

    documentDetailToOrderDetail(details: OrderDetailDocument[], currency: string): any {
        const detail = details.map((document) => ({
            productId: document.productId.toString(),
            title: document.title,
            description: document.description,
            unitPrice: `${currency} ${document.unitPrice.toFixed(2)}`,
            quantity: document.quantity,
            subTotal: `${currency} ${document.subTotal.toFixed(2)}`,
            note: document.note,
            subDetail: this.documentSubDetailToOrderSubDetail(document.subDetail)
        }))
        return detail
    }

    documentSubDetailToOrderSubDetail(subDetails?: OrderSubDetailDocument[]): any {
        const result = subDetails.map((subDocument) => ({
            productId: subDocument.productId.toString(),
            title: subDocument.title,
            quantity: subDocument.quantity
        }))
        return result
    }

    paddy(num, padlen, padchar?) {
        const pad_char = typeof padchar !== 'undefined' ? padchar : '0';
        const pad = new Array(1 + padlen).join(pad_char);
        return (pad + num).slice(-pad.length);
    }
}