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


export async function queryGetLocalization(){
  const clientId = sessionStorage.getItem("myID");
  const query = `
    query {
      localizations(clientId: "${clientId}") {
        locales {
          paramKey
          paramValue
          language
        }
      }
    }
  `;

  const body = JSON.stringify({ query });

  const res = await fetch( getGraphQLurl(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body
  });  
  const json = await res.json();
  console.log( "GraphQL queryGetLocalization response: ", json);   
  
  return json.data.localizations;
}

// GraphQL mutation
export interface RegisterUserInput {
  login: string;
  fullName: string;
  password: string;
}

export interface RegisterUserResponse {
  acknowledged: boolean;
  error?: string;
  user?: {
    userId: string;
    login: string;
    fullName: string;
  };
}
/* Schema on backend
type Mutation {
    registerUser(input: RegisterUserInput!): RegisterUserPayload!
}

  */
export async function mutationRegisterUser(input: RegisterUserInput): Promise<RegisterUserResponse> {
  const body = JSON.stringify({
    query: `
      mutation RegisterUser($input: RegisterUserInput!) {
        registerUser(input: $input) {
          acknowledged
          error
          user {
            userId
            login
            fullName
          }
        }
      }
    `,
    variables: {
      input
    }
  });

  console.log("*** Sending GraphQL mutation mutationRegisterUser with body:", body);
  const res = await fetch(getGraphQLurl(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body
  });

  const json = await res.json();
  console.log("*** Received GraphQL mutation response ", json);

  console.log("GraphQL registerUser response:", json);

  // GraphQL always wraps data in 'data'
  return json.data.registerUser;
}


// RefreshLogin mutation
/*schema on backend
  type Mutation {
    refreshToken(clientId: ID!, refreshToken: String!): RefreshTokenResponse!
  }
  type RefreshTokenResponse {
    accessToken: String!
    refreshToken: String!
    userId: Int!
    isOnline: Boolean!
    error: String
  }
*/ 
interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  userId: number;
  isOnline: boolean;
  error?: string | null;
}

/* REST call
  const refreshToken = sessionStorage.getItem("refreshToken");
  const body = JSON.stringify({ refreshToken } );
  console.log("POST sending: ", body );
  const resp : ApiResponse = await sendPOSTRequestAsync(POSTloginRefreshEndpoint, body );
  if( resp.status != StatusCodes.OK )
    return null;
  return resp.data; */

  
export async function mutationRefreshLogin(): Promise<RefreshTokenResponse> {
  const refreshToken = sessionStorage.getItem("refreshToken");
  const clientId = sessionStorage.getItem("myID");
  
  const query = `
    mutation RefreshToken($clientId: String!, $refreshToken: String) {
      refreshToken(clientId: $clientId, refreshToken: $refreshToken) {
        accessToken
        refreshToken
        userId
        isOnline
        error
      }
    }
  `;

  const variables = { clientId, refreshToken };
  const body = JSON.stringify({ query, variables });
  const res = await fetch(getGraphQLurl(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body
  });

  const json = await res.json();
  console.log("*** Received GraphQL mutation response ", json);
  

  console.log("GraphQL refreshToken response:", json);

  // GraphQL always wraps data in 'data'
  return json.data.refreshToken;
}




