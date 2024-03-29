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
    payment_method?: string,
    detail: [{
        product_id: string,
        product_type: string,
        title: string,
        description: string,
        unit_price: Number,
        quantity: Number,
        sub_total: Number,
        note?: string,
        sub_detail?: [{
            product_id: string,
            title: string,
            quantity: Number
        }]
    }],
    total: Number
}