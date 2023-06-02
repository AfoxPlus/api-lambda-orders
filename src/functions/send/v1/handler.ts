import { Order } from '@core/entities/Order'
import { MongoDBOrderRepository } from '@core/repositories/database/MongoDBOrderRepository'
import { OrderSendRequest } from '@core/repositories/models/OrderSendRequest';
import { OrderRepository } from '@core/repositories/OrderRepository';
import { mongodbconnect } from '@core/utils/mongodb_connection';
import { formatJSONErrorResponse, formatJSONSuccessResponse, ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway'
import { middyfy } from '@libs/lambda'
import schema from './schema'

const send: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (context) => {
  try {
    await mongodbconnect()
    const orderRepository: OrderRepository = new MongoDBOrderRepository()
    const orderRequest: OrderSendRequest = context.body
    const order: Order = {
      id: "",
      date: new Date(orderRequest.date),
      restaurantId: orderRequest.restaurant_id,
      tableNumber: orderRequest.table_number,
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