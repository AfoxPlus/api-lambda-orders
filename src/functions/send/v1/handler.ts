import { Order } from '@core/entities/Order'
import { MongoDBOrderRepository } from '@core/repositories/database/MongoDBOrderRepository'
import { OrderRepository } from '@core/repositories/OrderRepository';
import { mongodbconnect } from '@core/utils/mongodb_connection';
import { formatJSONErrorResponse, formatJSONSuccessResponse, ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway'
import { middyfy } from '@libs/lambda'
import { OrderSendRequest } from '@functions/send/v1/OrderSendRequest';

const send: ValidatedEventAPIGatewayProxyEvent<OrderSendRequest> = async (context) => {
  try {
    await mongodbconnect()
    const orderRepository: OrderRepository = new MongoDBOrderRepository()
    const orderRequest: OrderSendRequest = context.body as OrderSendRequest
    const { user_uuid } = context.headers
    const number = await orderRepository.getNumberOrder(orderRequest.restaurant_id)
    const order: Order = {
      number: number,
      user_uuid: user_uuid,
      restaurant: orderRequest.restaurant_id,
      currencySymbol: orderRequest.currencySymbol,
      orderType: {
        code: orderRequest.orderType.code,
        description: orderRequest.orderType.description
      },
      total: orderRequest.total,
      client: {
        cel: orderRequest.client.cel,
        name: orderRequest.client.name,
        addressReference: orderRequest.client.addressReference
      },
      detail: orderRequest.detail.map(item => ({
        productId: item.product_id,
        description: item.description,
        unitPrice: item.unit_price,
        quantity: item.quantity,
        subTotal: item.sub_total
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