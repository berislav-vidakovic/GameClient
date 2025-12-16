// hubAPI.ts

// Implements the following Design patterns:
// Facade → hubAPI.ts
// Strategy → REST vs GraphQL selection
// Adapter → Normalizing REST & GraphQL responses

import { getAllUsersREST, refreshLoginREST } from './restAPIsend';
import { queryGetAllUsers } from './graphQL';

// Strategy pattern
let apiOption: 'REST' | 'GraphQL' = 'REST';

export function setApiOption(option: 'REST' | 'GraphQL') {
  apiOption = option;
}

export async function getAllUsersAPI() {
  if( apiOption == 'GraphQL' ) 
    return await queryGetAllUsers();
  //apiOption == 'REST'  
  return await getAllUsersREST();
}

export async function refreshLoginAPI() {
  if( apiOption == 'GraphQL' ) 
    return null; // GraphQL version not implemented 
  //apiOption == 'REST'  
  return await refreshLoginREST();
}
