export interface OrderStatus {
    id: string,
    number: string,
    date: string,
    state: string,
    restaurant: string,
    orderType: {
        code: string,
        description: string
    },
    total: string,
    client: {
        name: string,
        cel?: string,
        addressReference?: string
    },
    detail: [{
        productId: string,
        description: string,
        unitPrice: string,
        quantity: Number,
        subTotal: string
    }]
}