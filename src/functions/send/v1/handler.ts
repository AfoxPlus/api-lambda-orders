import { Order } from '@core/entities/Order'
import { MongoDBOrderRepository } from '@core/repositories/database/MongoDBOrderRepository'
import { OrderRepository } from '@core/repositories/OrderRepository';
import { mongodbconnect } from '@core/utils/mongodb_connection';
import { formatJSONErrorResponse, formatJSONSuccessResponse, ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway'
import { middyfy } from '@libs/lambda'
import { OrderSendRequest } from '@core/models/request/OrderSendRequest';

const send: ValidatedEventAPIGatewayProxyEvent<OrderSendRequest> = async (context) => {
  try {
    await mongodbconnect()
    const orderRepository: OrderRepository = new MongoDBOrderRepository()
    const orderRequest: OrderSendRequest = context.body
    const { user_uuid } = context.headers

    const order: Order = {
      id: "",
      state: "Pendiente",
      isDone: false,
      user_uuid: user_uuid,
      date: new Date(orderRequest.date),
      restaurant: orderRequest.restaurant_id,
      delivery_type: orderRequest.delivery_type,
      total: orderRequest.total,
      client: {
        cel: orderRequest.client.cel,
        name: orderRequest.client.name
      },
      detail: orderRequest.detail.map(item => ({
        productId: item.product_id,
        description: item.description,
        unitPrice: item.unit_price,
        quantity: item.quantity,
        subTotal: item.sub_total,
        currencyCode: item.currency_code
      }))
    }
    const result = await orderRepository.send(order)
    return formatJSONSuccessResponse({
      success: true,
      payload: result,
      message: "Send OK"
    });
  } catch (err) {
    return formatJSONErrorResponse(err);
  }
}


export const main = middyfy(send);