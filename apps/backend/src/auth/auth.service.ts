import argon2 from "argon2";
import { prismaClient } from '@watchtower/db';
import { getRedis } from "../lib/redis";
import crypto from "crypto"


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

async function login(identifier : string, password: string) {
    
    const user = await prismaClient.user.findFirst({
        where:{
            OR: [
                {email: identifier},
                {username: identifier}
            ]
        }
    })

    if(!user){
        return "invalid credentials";
    }

   const validPassword = await argon2.verify( user.password, password);


   if(!validPassword){
    return "invalid credentials";
   }

   const sessionId = await createSession(user.id);

   return sessionId;
}



async function createSession(userId:  string) : Promise<string>{

    const redis  = await getRedis();
    const sessionId  = crypto.randomBytes(32).toString("hex");

    await redis.set(`session:${sessionId}`, userId, {
        expiration :{
            type: "EX",
            value: 60 * 60 * 24 * 7
        }
    }
);
 
return sessionId;

}