import { MongoDBOrderRepository } from '@core/repositories/database/MongoDBOrderRepository'
import { OrderRepository } from '@core/repositories/OrderRepository';
import { mongodbconnect } from '@core/utils/mongodb_connection';
import { formatJSONErrorResponse, formatJSONSuccessResponse } from '@libs/apiGateway'
import { middyfy } from '@libs/lambda'
import { APIGatewayProxyHandler } from 'aws-lambda/trigger/api-gateway-proxy';

const archive: APIGatewayProxyHandler = async (context) => {
  try {
    await mongodbconnect()
    const orderRepository: OrderRepository = new MongoDBOrderRepository()
    const { order_id } = context.pathParameters
    const result = await orderRepository.archive(order_id)
    return formatJSONSuccessResponse({
      success: result,
      payload: {},
      message: "Order ID:" + order_id
    });

  } catch (err) {
    return formatJSONErrorResponse(err);
  }
}


export const main = middyfy(archive);