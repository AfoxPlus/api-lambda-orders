import { MongoDBOrderRepository } from '@core/repositories/database/MongoDBOrderRepository'
import { OrderRepository } from '@core/repositories/OrderRepository';
import { mongodbconnect } from '@core/utils/mongodb_connection';
import { formatJSONErrorResponse, formatJSONSuccessResponse, ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway'
import { middyfy } from '@libs/lambda'
import { OrderSendRequest } from '@functions/send/v1/OrderSendRequest';
import { mapRequestToOrder } from '@functions/send/v1/mapper';

const send: ValidatedEventAPIGatewayProxyEvent<OrderSendRequest> = async (context) => {
  try {
    await mongodbconnect()
    const orderRepository: OrderRepository = new MongoDBOrderRepository()
    const orderRequest: OrderSendRequest = context.body as OrderSendRequest
    const { user_uuid, currency_id } = context.headers

    const order = mapRequestToOrder(orderRequest, user_uuid, currency_id)
    const result = await orderRepository.send(order, orderRequest.restaurant_id)

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