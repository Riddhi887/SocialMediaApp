//this file heps to generate token for the new user 
import JWT from 'jsonwebtoken';
import { prismaClient } from "../clients/db";
import { User } from '../generated/prisma';
const JWT_SECRET = '$wami@09'; //dont share with anyone

class JWTService{
    public static  generateTokenForUser(user: User) {
        //required parameters
        const payload = {
            id: user?.id,
            email: user?.id,
        };
        const token = JWT.sign(payload, JWT_SECRET); 
        return token;
    }
}

export default JWTService;