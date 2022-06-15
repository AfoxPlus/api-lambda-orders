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
    date: Date,
    tableNumber: string,
    total: Number,
    client: Client,
    detail : OrderDetail[]
}