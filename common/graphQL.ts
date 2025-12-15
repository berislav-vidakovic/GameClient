 const url = "http://localhost:8083/graphql";


export async function queryPingDb(){
  const body = JSON.stringify({ query: "{ pingDb }"});
  const res = await fetch( url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body
  });  
  const json = await res.json();
  console.log( "GraphQL response: ", json);
}

export async function queryGetAllUsers(){
    const body = JSON.stringify({ 
      query: `{ getAllUsers { id, techstack, users { userId, login, fullName, isOnline } } }` });

    const res = await fetch( url, {
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

