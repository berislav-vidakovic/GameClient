import { URL_BACKEND_HTTP } from './config';

const getGraphQLurl = () => URL_BACKEND_HTTP + "/graphql";

export async function queryPing(){  
  const body = JSON.stringify({ query: "{ ping }"});
  const res = await fetch( getGraphQLurl(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body
  });  
  const json = await res.json();
  console.log( "GraphQL Ping response: ", json);
}

export async function queryPingDb(){  
  const body = JSON.stringify({ query: "{ pingDb }"});
  const res = await fetch( getGraphQLurl(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body
  });  
  const json = await res.json();
  console.log( "GraphQL PingDB response: ", json);
}

export async function queryGetAllUsers(){
  const body = JSON.stringify({ 
    query: `{ getAllUsers { id, techstack, users { userId, login, fullName, isOnline } } }` });

  const res = await fetch( getGraphQLurl(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body
  });  
  const json = await res.json();
  console.log( "GraphQL getAllUsers response: ", json);   
  
  return json.data.getAllUsers;
}

