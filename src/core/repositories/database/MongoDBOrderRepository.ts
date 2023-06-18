import { Order } from "@core/entities/Order";
import { OrderStatusResponse } from "@core/models/response/OrderStatusResponse";
import { OrderRepository } from "@core/repositories/OrderRepository";
import { OrderDocument, OrderModel } from "@core/repositories/database/models/order.model";
import { RestaurantModel } from "@core/repositories/database/models/restaurant.model";

export class MongoDBOrderRepository implements OrderRepository {
    findOne = async (orderId: string): Promise<Order> => {
        try {
            const result = await OrderModel.findById(orderId)
                .populate({ path: 'restaurant', model: RestaurantModel })
            return {
                id: result._id.toString(),
                user_uuid: result.user_uuid.toString(),
                date: result.date,
                state: result.state,
                isDone: result.is_done,
                restaurant: result.restaurant.name,
                delivery_type: result.delivery_type,
                total: result.total,
                client: result.client,
                detail: result.detail.map((document) => ({
                    productId: document.productId.toString(),
                    description: document.description,
                    unitPrice: document.unitPrice,
                    quantity: document.quantity,
                    subTotal: document.subTotal,
                    currencyCode: document.currencyCode
                }))
            }
        } catch (err) {
            throw new Error("Internal Error")
        }
    }

    status = async (userUUID: string): Promise<OrderStatusResponse[]> => {
        try {
            const result: OrderDocument[] = await OrderModel.find({ user_uuid: userUUID, is_done: false })
                .populate({ path: 'restaurant', model: RestaurantModel })
            return result.map((document) => ({
                id: document._id.toString(),
                state: document.state.toString(),
                total: document.total,
                delivery_type: document.delivery_type,
                restaurant: document.restaurant.name
            }))
        } catch (err) {
            throw new Error("Internal Error")
        }
    }
    send = async (order: Order): Promise<OrderStatusResponse> => {
        try {
            let result: OrderDocument = await OrderModel.create(order)
            result = await result.populate({ path: 'restaurant', model: RestaurantModel })
            return {
                id: result._id.toString(),
                state: result.state.toString(),
                total: result.total,
                delivery_type: result.delivery_type,
                restaurant: result.restaurant.name
            }

        } catch (err) {
            throw new Error("Internal Error")
        }
    }
}