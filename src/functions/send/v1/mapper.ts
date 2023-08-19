import { Order } from "@core/entities/Order"
import { OrderSendRequest } from "@functions/send/v1/OrderSendRequest"

export const mapRequestToOrder = (orderRequest: OrderSendRequest, user_uuid: string, currency_id: string): Order => {
    const order: Order = {
        userUUID: user_uuid,
        restaurant: orderRequest.restaurant_id,
        paymentMethod: orderRequest.payment_method,
        currency: currency_id,
        orderType: {
            code: orderRequest.order_type.code,
            title: orderRequest.order_type.title,
            description: orderRequest.order_type.description
        },
        total: orderRequest.total,
        client: {
            cel: orderRequest.client.cel,
            name: orderRequest.client.name,
            addressReference: orderRequest.client.address_reference
        },
        detail: orderRequest.detail.map(item => ({
            productId: item.product_id,
            productType: item.product_type,
            title: item.title,
            description: item.description,
            unitPrice: item.unit_price,
            quantity: item.quantity,
            subTotal: item.sub_total,
            note: item.note,
            subDetail: item.sub_detail?.map(subItem => ({
                productId: subItem.product_id,
                title: subItem.title,
                quantity: subItem.quantity
            }))
        }))
    }
    return order
}