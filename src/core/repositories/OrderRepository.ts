
import { Order } from "@core/entities/Order";
import { OrderState } from "@core/entities/OrderState";
import { OrderStatus } from "@core/entities/OrderStatus";

export interface OrderRepository {
    send(order: Order, restaurantCode: string): Promise<OrderStatus>
    status(userUUID: string): Promise<OrderStatus[]>
    statusByRestaurant(restaurantCode: string): Promise<OrderStatus[]>
    findOne(orderId: string): Promise<OrderStatus>
    getOrderStates(): Promise<OrderState[]>
    updateOrderState(orderId: string, newOrderStateId: string): Promise<OrderStatus>
}