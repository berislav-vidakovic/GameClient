import { sendGETRequestAsync } from './restAPI';
import type { ApiResponse } from './restAPI';
import { StatusCodes } from 'http-status-codes';

const GETusersEndpoint = 'api/users/all';
//const POSTuserRegisterEndpoint = 'api/users/new';
//const POSTuserLoginEndpoint = 'api/users/login';
//const POSTloginRefreshEndpoint = 'api/auth/refresh';
//const POSTuserLogoutEndpoint = 'api/users/logout';
//const POSTinviteEndpoint = 'api/invitations/invite';
//const POSTcancelEndpoint = 'api/invitations/cancel';
//const POSTacceptEndpoint = 'api/invitations/accept';
//const POSTrejectEndpoint = 'api/invitations/reject';
//const POSTrunGame = 'api/games/run';

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