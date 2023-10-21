import { handlerPath } from '@libs/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'DELETE',
        path: 'orders/archive/{order_id}'
      }
    }
  ]
}