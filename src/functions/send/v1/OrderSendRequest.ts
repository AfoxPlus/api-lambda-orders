export interface OrderSendRequest {
    client: {
        name: string,
        cel?: string,
        address_reference?: string
    },
    order_type: {
        code: string,
        title: string,
        description?: string
    },
    restaurant_id: string,
    detail: [{
        product_id: string,
        title: string,
        description: string,
        unit_price: Number,
        quantity: Number,
        sub_total: Number
    }],
    total: Number
}