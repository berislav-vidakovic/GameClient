import { sendGETRequestAsync, sendPOSTRequestAsync } from './restAPI';
import type { ApiResponse } from './restAPI';
import { StatusCodes } from 'http-status-codes';

const GETusersEndpoint = 'api/users/all';
const POSTuserRegisterEndpoint = 'api/users/new';
const POSTuserLoginEndpoint = 'api/users/login';
const POSTloginRefreshEndpoint = 'api/auth/refresh';
const POSTuserLogoutEndpoint = 'api/users/logout';
//const POSTinviteEndpoint = 'api/invitations/invite';
//const POSTcancelEndpoint = 'api/invitations/cancel';
//const POSTacceptEndpoint = 'api/invitations/accept';
//const POSTrejectEndpoint = 'api/invitations/reject';
//const POSTrunGame = 'api/games/run';
const GETlocalizationEnpoint = 'api/localization/get';

export async function getAllUsersREST() {
  let jsonResp: string = "";
  //sendGETRequest(GETusersEndpoint, handleResponseGetAllUsers);
  const apiResp : ApiResponse = await sendGETRequestAsync(GETusersEndpoint);
  if( apiResp.status == StatusCodes.OK )
    jsonResp = apiResp.data;
  else
    console.error("Error fetching all users. STATUS: ", apiResp.status );

  // Adapter pattern - normalize responses
  return jsonResp;
}

export async function refreshLoginREST(){
  const refreshToken = sessionStorage.getItem("refreshToken");
  const body = JSON.stringify({ refreshToken } );
  
  // sendPOSTRequest(POSTloginRefreshEndpoint, body, handleLoginRefresh );
  console.log("POST sending: ", body );
  
  const resp : ApiResponse = await sendPOSTRequestAsync(POSTloginRefreshEndpoint, body );
  if( resp.status != StatusCodes.OK )
    return null;

  return resp.data;
}

export async function getLocalizationREST(){
  const resp:ApiResponse = await sendGETRequestAsync(GETlocalizationEnpoint);
  if( resp.status == StatusCodes.OK )
    return resp.data;
  return null;
}

export async function logoutUserREST( userId: number){
  const body = JSON.stringify({ userId } );
  const resp:ApiResponse = await sendPOSTRequestAsync(POSTuserLogoutEndpoint, body);
  if( resp.status == StatusCodes.OK )
    return resp.data;
  return null;
}


export async function loginUserREST(userId: number, password: string) {
  const body = JSON.stringify({ userId, password } );
  
  const resp:ApiResponse = await sendPOSTRequestAsync(POSTuserLoginEndpoint, body);
  if( resp.status == StatusCodes.OK )
    return resp.data;
  return null;
}


export async function registerUserREST(login: string, fullname: string, password: string) {
  const body = JSON.stringify({ register: { login, fullname, password } } );
  const resp:ApiResponse = await sendPOSTRequestAsync(POSTuserRegisterEndpoint, body);
  console.log("REg Response: ", resp.data);
  if( resp.status == StatusCodes.OK || resp.status == StatusCodes.CREATED )
    return resp.data;
  return null;
}
