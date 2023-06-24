import { Order } from "@core/entities/Order";
import { OrderStatus } from "@core/entities/OrderStatus";
import { OrderRepository } from "@core/repositories/OrderRepository";
import { OrderDocument, OrderModel } from "@core/repositories/database/models/order.model";
import { RestaurantModel } from "@core/repositories/database/models/restaurant.model";

export class MongoDBOrderRepository implements OrderRepository {
    getNumberOrder = async (restaurantCode: string): Promise<string> => {
        try {
            const result: number = await OrderModel.countDocuments({ restaurant: restaurantCode })
            const number = result + 1
            return this.paddy(number, 6).toString()
        } catch (err) {
            throw new Error("Internal Error")
        }
    }
    findOne = async (orderId: string): Promise<Order> => {
        try {
            const result = await OrderModel.findById(orderId)
                .populate({ path: 'restaurant', model: RestaurantModel })
            return this.documentToOrder(result)
        } catch (err) {
            throw new Error("Internal Error")
        }
    }

    status = async (userUUID: string): Promise<OrderStatus[]> => {
        try {
            const result: OrderDocument[] = await OrderModel.find({ user_uuid: userUUID, is_done: false })
                .populate({ path: 'restaurant', model: RestaurantModel })
            return result.map((document) => this.documentToOrder(document))
        } catch (err) {
            throw new Error("Internal Error")
        }
    }
    send = async (order: Order): Promise<OrderStatus> => {
        try {
            let result: OrderDocument = await OrderModel.create(order)
            result = await result.populate({ path: 'restaurant', model: RestaurantModel })
            return this.documentToOrder(result)
        } catch (err) {
            throw new Error("Internal Error")
        }
    }

    documentToOrder(result: any): OrderStatus {
        return {
            id: result._id.toString(),
            number: `#${result.number}`,
            date: result.date.toString(),
            state: result.state,
            restaurant: result.restaurant.name,
            orderType: result.orderType,
            total: `${result.currencySymbol} ${result.total}`,
            client: result.client,
            detail: result.detail.map((document) => ({
                productId: document.productId.toString(),
                description: document.description,
                unitPrice: `${result.currencySymbol} ${result.unitPrice}`,
                quantity: document.quantity,
                subTotal: `${result.currencySymbol} ${result.subTotal}`
            }))
        }
    }

    paddy(num, padlen, padchar?) {
        const pad_char = typeof padchar !== 'undefined' ? padchar : '0';
        const pad = new Array(1 + padlen).join(pad_char);
        return (pad + num).slice(-pad.length);
    }
}