import { Order } from "@core/entities/Order";
import { OrderStatusResponse } from "@core/models/response/OrderStatusResponse";
import { OrderRepository } from "@core/repositories/OrderRepository";
import { OrderDocument, OrderModel } from "@core/repositories/database/models/order.model";
import { RestaurantModel } from "@core/repositories/database/models/restaurant.model";

export class MongoDBOrderRepository implements OrderRepository {
    send = async (order: Order): Promise<OrderStatusResponse> => {
        try {
            let result: OrderDocument = await OrderModel.create(order)
            result = await result.populate({ path: 'restaurant', model: RestaurantModel })
            return {
                id: result._id.toString(),
                status: result.state.toString(),
                total: result.total,
                delivery_type: result.delivery_type,
                restaurant: result.restaurant.name
            }

        } catch (err) {
            throw new Error("Internal Error")
        }
    }
}