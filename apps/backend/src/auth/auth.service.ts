import argon2 from "argon2";
import { prismaClient } from '@watchtower/db';

/**
 * register() => registers the user
 * login() => allow user to login 
 * createSession() => creates redis session
 * validateSession() => validates the session 
 * deleteSession() => deletes the session 
 */

async function register(email : string, username : string, password : string ) : Promise<string> {
   
     const existingUser = await prismaClient.user.findFirst({
        where: {
            OR: [
                { email },
                { username }
            ]
        }
    });
    if(existingUser){
        return "username or email already exist";
    }
    
    const passwordHash = await argon2.hash(password);


    const output = prismaClient.user.create({
        data: {
            email,
            username, 
            password : passwordHash
        }
    })
   

    return "success";
}

async function login(identifier : string, password: string) : Promise<string> {

}