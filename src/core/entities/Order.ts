export interface OrderDetail {
    productId: string,
    description: string,
    unitPrice: Number,
    quantity: Number,
    subTotal: Number
}

export interface Client {
    name: string,
    cel?: string,
    addressReference?: string
}

export interface Order {
    id?: string,
    user_uuid?: string,
    number?: string,
    date?: string,
    currencySymbol: string,
    state?: string,
    isDone?: Boolean,
    restaurant: string,
    orderType: OrderType,
    total: Number,
    client: Client,
    detail: OrderDetail[]
}

export interface OrderType {
    code?: string,
    description: string
}