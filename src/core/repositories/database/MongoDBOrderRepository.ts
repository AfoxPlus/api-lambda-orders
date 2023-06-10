import { Order } from "@core/entities/Order";
import { OrderSendResponse } from "../models/OrderSendResponse";
import { OrderRepository } from "../OrderRepository";
import { OrderDocument, OrderModel } from "./models/order.model";

export class MongoDBOrderRepository implements OrderRepository {
    send = async (order: Order): Promise<OrderSendResponse> => {
        try {
            const result: OrderDocument = await OrderModel.create(order)
            return {
                id: result._id.toString(),
                status: result.state.toString()
            }

        } catch (err) {
            throw new Error("Internal Error")
        }
    }
}