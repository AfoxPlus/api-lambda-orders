export interface OrderDetail {
    productId: string,
    title: string,
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
    userUUID?: string,
    number?: string,
    date?: string,
    state?: string,
    isDone?: Boolean,
    currency: string,
    restaurant: string,
    orderType: OrderType,
    total: Number,
    client: Client,
    detail: OrderDetail[]
}

export interface OrderType {
    code?: string,
    title: string,
    description?: string
}