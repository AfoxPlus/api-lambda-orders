export interface OrderDetail {
    productId: string,
    description: string,
    unitPrice: Number,
    quantity: Number,
    subTotal: Number,
    currencyCode: string
}

export interface Client {
    name: string,
    cel: string
}

export interface Order {
    id: string,
    user_uuid: string,
    date: Date,
    restaurantId: string,
    delivery_type: string,
    total: Number,
    client: Client,
    detail: OrderDetail[]
}