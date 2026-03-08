//this file heps to generate token for the new user 
import JWT from 'jsonwebtoken';
import { User } from '../generated/prisma';
const JWT_SECRET = process.env.JWT_SECRET;

class JWTService{
    public static  generateTokenForUser(user: User) {
        if (!JWT_SECRET) {
            throw new Error("JWT_SECRET is not configured");
        }

        //required parameters
        const payload = {
            id: user?.id,
            email: user?.email,
        };
        const token = JWT.sign(payload, JWT_SECRET); 
        return token;
    }
}

export default JWTService;