import { Order } from "@core/entities/Order";
import { OrderStatus } from "@core/entities/OrderStatus";
import { OrderRepository } from "@core/repositories/OrderRepository";
import { OrderDetailDocument, OrderDocument, OrderModel } from "@core/repositories/database/models/order.model";
import { RestaurantModel } from "@core/repositories/database/models/restaurant.model";
import { CurrencyModel } from "@core/repositories/database/models/currency.model";
import moment from 'moment';

export class MongoDBOrderRepository implements OrderRepository {

    findOne = async (orderId: string): Promise<OrderStatus> => {
        try {
            const result = await OrderModel.findById(orderId)
                .populate({ path: 'restaurant', model: RestaurantModel })
                .populate({ path: 'currency', model: CurrencyModel })
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
            return result.map((document) => this.documentToOrder(document))
        } catch (err) {
            throw new Error("Internal Error")
        }
    }

    send = async (order: Order, restaurantCode: string): Promise<OrderStatus> => {
        try {
            const currentNumber: number = await OrderModel.countDocuments({ restaurant: restaurantCode })
            order.number = this.paddy((currentNumber + 1), 6).toString()
            let result: OrderDocument = await OrderModel.create(order)
            result = await (await result.populate({ path: 'restaurant', model: RestaurantModel })).populate({ path: 'currency', model: CurrencyModel })
            return this.documentToOrder(result)
        } catch (err) {
            throw new Error("Internal Error")
        }
    }

    documentToOrder(result: OrderDocument): OrderStatus {
        return {
            id: result._id.toString(),
            number: `#${result.number}`,
            date: (moment(result.date)).format('DD MMM YYYY, hh:mm A'),
            state: result.state.toString(),
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
            description: document.description,
            unitPrice: `${currency} ${document.unitPrice.toFixed(2)}`,
            quantity: document.quantity,
            subTotal: `${currency} ${document.subTotal.toFixed(2)}`
        }))
        return detail
    }

    paddy(num, padlen, padchar?) {
        const pad_char = typeof padchar !== 'undefined' ? padchar : '0';
        const pad = new Array(1 + padlen).join(pad_char);
        return (pad + num).slice(-pad.length);
    }
}