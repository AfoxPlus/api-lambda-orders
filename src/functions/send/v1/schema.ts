export default {
    type: "object",
    properties: {
        client: { type: 'object', properties: {
            name: {type: 'string' },
            cel: {type: 'string'}
        },
        table_numbe: {type: 'string'},
        restaurant_id: {type: 'string'},
        total: {type: 'number'},
        date: {type: 'string'},
        detail: {type: 'array'}
    },
    },
    required: ['name']
  } as const;