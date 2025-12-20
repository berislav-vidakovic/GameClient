// graphqlWs.ts
import { createClient } from "graphql-ws";
//import { URL_BACKEND_WS } from './config'; //ws://localhost:8082/websocket

const getGraphQLurlWs = () => {  
  return "ws://localhost:8082/graphql"
}

export const wsClient = createClient({
  url: getGraphQLurlWs()
});

export function subscribeUserRegistered(
  onUser: (user: any) => void
) {
  return wsClient.subscribe(
    {
      query: `
        subscription {
          userRegistered {
            userId
            login
            fullName
            isOnline
          }
        }
      `
    },
    {
      next: (data) => {
        onUser(data.data.userRegistered);
      },
      error: (err) => console.error(err),
      complete: () => console.log("Subscription completed")
    }
  );
}
