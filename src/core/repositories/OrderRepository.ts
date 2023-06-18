
import { Order } from "@core/entities/Order";
import { OrderStatusResponse } from "@core/models/response/OrderStatusResponse";

export interface OrderRepository {
    send(order: Order): Promise<OrderStatusResponse>
    status(userUUID: string): Promise<OrderStatusResponse[]>
    findOne(orderId: string): Promise<Order>
}