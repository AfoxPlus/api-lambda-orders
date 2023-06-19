
import { Order } from "@core/entities/Order";

export interface OrderRepository {
    send(order: Order): Promise<Order>
    status(userUUID: string): Promise<Order[]>
    findOne(orderId: string): Promise<Order>
    getNumberOrder(restaurantCode: string): Promise<string>
}