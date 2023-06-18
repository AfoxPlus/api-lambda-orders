export interface OrderSendRequest {
    client: {
        name: string,
        cel: string
    },
    date: string,
    delivery_type: string,
    restaurant_id: string,
    detail: [{
        product_id: string,
        description: string,
        unit_price: Number,
        quantity: Number,
        sub_total: Number,
        currency_code: string
    }],
    total: Number
}