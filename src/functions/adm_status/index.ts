import { handlerPath } from '@libs/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'orders/restaurant/status/{state_id}'
      }
    },
    {
      http: {
        method: 'get',
        path: 'orders/restaurant/status'
      }
    }
  ]
}