import { Order } from "@core/entities/Order";
import { OrderSendResponse } from "./models/OrderSendResponse";

export interface OrderRepository {
    send(order: Order): Promise<OrderSendResponse>
}