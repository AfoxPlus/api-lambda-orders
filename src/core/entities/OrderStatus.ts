export interface OrderStatus {
    id: string,
    number: string,
    date: string,
    state: string,
    restaurant: string,
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
        description: string,
        unitPrice: string,
        quantity: Number,
        subTotal: string
    }]
}