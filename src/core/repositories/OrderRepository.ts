
import { Order } from "@core/entities/Order";
import { OrderStatus } from "@core/entities/OrderStatus";

export interface OrderRepository {
    send(order: Order, restaurantCode: string): Promise<OrderStatus>
    status(userUUID: string): Promise<OrderStatus[]>
    findOne(orderId: string): Promise<OrderStatus>
}