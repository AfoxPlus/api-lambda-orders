export interface OrderStatus {
    fcm_token?: string,
    id: string,
    number: string,
    date: string,
    state: string,
    state_code: string,
    restaurant: string,
    payment_method?: string,
    order_type: {
        code: string,
        title: string,
        description?: string
    },
    total: string,
    client: {
        name: string,
        cel?: string,
        address_reference?: string
    },
    detail: [{
        productId: string,
        title: string,
        description: string,
        unitPrice: string,
        quantity: Number,
        subTotal: string
    }]
}