export interface OrderSendRequest {
    client: {
        name: string,
        cel?: string,
        addressReference?: string
    },
    orderType: {
        code: string,
        description: string
    },
    restaurant_id: string,
    detail: [{
        product_id: string,
        description: string,
        unit_price: Number,
        quantity: Number,
        sub_total: Number
    }],
    total: Number
}