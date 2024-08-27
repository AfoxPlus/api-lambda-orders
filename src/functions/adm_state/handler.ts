import { MongoDBOrderRepository } from '@core/repositories/database/MongoDBOrderRepository'
import { OrderRepository } from '@core/repositories/OrderRepository';
import { mongodbconnect } from '@core/utils/mongodb_connection';
import { formatJSONErrorResponse, formatJSONSuccessResponse, ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway'
import { middyfy } from '@libs/lambda'
import { OrderUpdateRequest } from '@functions/adm_state/OrderUpdateRequest';

const sendState: ValidatedEventAPIGatewayProxyEvent<OrderUpdateRequest> = async (context) => {
  try {
    await mongodbconnect()
    const orderRepository: OrderRepository = new MongoDBOrderRepository()
    const orderRequest: OrderUpdateRequest = context.body as OrderUpdateRequest
    const result = await orderRepository.updateOrderState(orderRequest.order_id, orderRequest.order_state)
    if (result == null) {
      return formatJSONSuccessResponse({
        success: false,
        payload: {},
        message: "Send state error"
      });
    }

    const title = "¡Buenas noticias, "+ result.client.name +"!"
    const body = "Tu pedido #"+ result.number +" cambió de estado a "+ result.state+". Sigue el estado en tiempo real en nuestra app."
    await orderRepository.sendOrderNotification(result.fcm_token, title, body)

    return formatJSONSuccessResponse({
      success: true,
      payload: result,
      message: "Send State OK"
    });
  } catch (err) {
    return formatJSONErrorResponse(err);
  }
}


export const main = middyfy(sendState);