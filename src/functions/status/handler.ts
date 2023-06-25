import { MongoDBOrderRepository } from '@core/repositories/database/MongoDBOrderRepository'
import { OrderRepository } from '@core/repositories/OrderRepository';
import { mongodbconnect } from '@core/utils/mongodb_connection';
import { formatJSONErrorResponse, formatJSONSuccessResponse } from '@libs/apiGateway'
import { middyfy } from '@libs/lambda'
import { APIGatewayProxyHandler } from 'aws-lambda/trigger/api-gateway-proxy';

const status: APIGatewayProxyHandler = async (context) => {
  try {
    await mongodbconnect()
    const orderRepository: OrderRepository = new MongoDBOrderRepository()
    const { user_uuid } = context.headers

    const result = await orderRepository.status(user_uuid)

    return formatJSONSuccessResponse({
      success: true,
      payload: result,
      message: "Get status"
    });

  } catch (err) {
    console.log(err)
    return formatJSONErrorResponse(err);
  }
}


export const main = middyfy(status);