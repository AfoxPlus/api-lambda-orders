import { Order } from "@core/entities/Order";
import { mongoCreateConection } from "@core/utils/mongodb_connection";
import { OrderSendResponse } from "../models/OrderSendResponse";
import { OrderRepository } from "../OrderRepository";
import { OrderDocument, OrderModel } from "./models/order.model";

export class MongoDBOrderRepository implements OrderRepository {

    send = async (order: Order): Promise<OrderSendResponse> => {
        try {
            const result: OrderDocument = await OrderModel.create(order)
            console.log(result)
            return {
                id: result._id.toString(),
                status: 'Pendiente'
            }

        } catch (err) {
            throw new Error("Internal Error")
        }
    }


}