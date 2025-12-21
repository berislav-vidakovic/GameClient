// hubAPI.ts

// Implements the following Design patterns:
// Facade - provides a simplified interface to the client code
//  -exposes a simplified API that  business logic can call without
//   worrying about the underlying implementation details.
//  -Hides complexity: The actual logic of deciding between REST and GraphQL, 
//   and calling different modules (restAPIsend vs graphQL) is hidden from the caller
//   The consumer just calls ...API() and gets the result

// Strategy - REST vs GraphQL selection
//  using apiOption to switch between REST and GraphQL
//  the implementation (strategy) is selected at runtime

// Adapter - Normalizing REST & GraphQL responses
//  If REST and GraphQL would return different formats, 
//  it can be normalized in these Facade functions before returning to the caller

import { getAllUsersREST, refreshLoginREST, getLocalizationREST,
  logoutUserREST, loginUserREST, registerUserREST, getSudokuBoardsREST,
  setTestedOkREST, updateSolutionREST, addGameREST, setNameREST} from './restAPIsend';
//import { /*queryGetAllUsers,*/ mutationRegisterUser } from './graphQL';

// Strategy pattern
let apiOption: 'REST' | 'GraphQL' = 'REST';

export function setApiOption(option: 'REST' | 'GraphQL') {
  apiOption = option;
}

export async function getAllUsersAPI() {
  //if( apiOption == 'GraphQL' ) 
  //return await queryGetAllUsers();
  //apiOption == 'REST'  
   return await getAllUsersREST();
}

export async function registerUserAPI(login: string, fullname: string, password: string) {
  //if( apiOption == 'GraphQL' ) {
   // return await mutationRegisterUser({ login, fullName: fullname, password });
  //}
  //apiOption == 'REST'  
  return await registerUserREST(login, fullname, password);
}

// ---------------------------- Added support for GraphQL API

export async function refreshLoginAPI() {
  if( apiOption == 'GraphQL' ) 
    return null; // GraphQL version not implemented 
  //apiOption == 'REST'  
  return await refreshLoginREST();
}

export async function getLocalizationAPI() {
  if( apiOption == 'GraphQL' ) 
    return null; // GraphQL version not implemented 
  //apiOption == 'REST'  
  return await getLocalizationREST();
}

export async function logoutUserAPI( userId : number) {
  if( apiOption == 'GraphQL' ) 
    return null; // GraphQL version not implemented 
  //apiOption == 'REST'  
  return await logoutUserREST(userId);
}

export async function loginUserAPI(userId: number, password: string) {
  if( apiOption == 'GraphQL' ) 
    return null; // GraphQL version not implemented 
  //apiOption == 'REST'  
  return await loginUserREST(userId, password);
}



// SUDOKU game API functions ----------------------------------------------
export async function getSudokuBoardsAPI(){
  if( apiOption == 'GraphQL' ) 
    return null; // GraphQL version not implemented 
  //apiOption == 'REST'  
  return await getSudokuBoardsREST();
}

export async function setTestedOkAPI(board: string){
  if( apiOption == 'GraphQL' ) 
    return null; // GraphQL version not implemented 
  //apiOption == 'REST'  
  return await setTestedOkREST(board);
}

export async function setNameAPI(board: string, name: string){
  if( apiOption == 'GraphQL' ) 
    return null; // GraphQL version not implemented 
  //apiOption == 'REST'  
  return await setNameREST(board, name);
}

export async function addGameAPI(board: string, name: string){
  if( apiOption == 'GraphQL' ) 
    return null; // GraphQL version not implemented 
  //apiOption == 'REST'  
  return await addGameREST(board, name);
}

export async function updateSolutionAPI(board: string, solution: string ){
  if( apiOption == 'GraphQL' ) 
    return null; // GraphQL version not implemented 
  //apiOption == 'REST'  
  return await updateSolutionREST(board, solution );
}
  

// CONNECT4 game API functions --------------------------------------------
