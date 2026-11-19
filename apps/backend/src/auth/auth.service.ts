import { prismaClient } from '@watchtower/db';


/**
 * register() => registers the user
 * login() => allow user to login 
 * createSession() => creates redis session
 * validateSession() => validates the session 
 * deleteSession() => deletes the session 
 */

function register(email : string, username : string, password : string ) : string {
   
    prismaClient.user.create({
        
    })
   

    return "success";
}