
import { Order } from "@core/entities/Order";
import { OrderState } from "@core/entities/OrderState";
import { OrderStatus } from "@core/entities/OrderStatus";

export interface OrderRepository {
    send(order: Order, restaurantCode: string): Promise<OrderStatus>
    status(userUUID: string): Promise<OrderStatus[]>
    statusByRestaurant(restaurantCode: string, stateId: string): Promise<OrderStatus[]>
    findOne(orderId: string): Promise<OrderStatus>
    archive(orderId: string): Promise<Boolean>
    getOrderStates(): Promise<OrderState[]>
    updateOrderState(orderId: string, newOrderStateId: string): Promise<OrderStatus>
    isValidProducts(productIds: string[]): Promise<string[]>
    sendOrderNotification(userFCMToken: string, title: string, body: string):Promise<Boolean>
}