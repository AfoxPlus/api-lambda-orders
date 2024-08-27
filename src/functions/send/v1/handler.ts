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
    const { user_uuid, currency_id, user_fcm_token } = context.headers

    const order = mapRequestToOrder(orderRequest,user_fcm_token, user_uuid, currency_id)
    const products = await orderRepository.isValidProducts(order.detail.map(item => item.productId))
    if (products.length == 0) {
      const result = await orderRepository.send(order, orderRequest.restaurant_id)

      const title = "¡Gracias por tu compra, "+ result.client.name +"! 🎉"
      const body = "Tu pedido "+ result.number +" ha sido enviado y pronto estaremos preparándolo para ti. Te avisaremos cuando esté listo."
      await orderRepository.sendOrderNotification(result.fcm_token, title, body).catch(_ => { })

      return formatJSONSuccessResponse({
        success: true,
        payload: result,
        message: {
          value: "!Pedido enviado correctamente!",
          info: ""
        }
      });
    } else {
      return formatJSONSuccessResponse({
        success: false,
        payload: {},
        message: {
          value: "Hubo un problema al enviar el pedido",
          info: "Uno o mas productos ya no se encuentran disponibles.",
          meta_data: products
        }
      });
    }


  } catch (err) {
    return formatJSONErrorResponse(err);
  }
}

export const main = middyfy(send);