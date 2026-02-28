//resolvers for all token
//1st resolver : you'll get a token
import axios from "axios";  //for api calling
import { GraphQLError } from "graphql";
import { prismaClient } from "../../src/clients/db";
import JWTService from "../../src/services/jwt";

//make interface to mimic the data 
interface GoogleTokenResult{
    iss?: string;
    nbf?: string;
    aud?: string;
    sub?: string;
    email: string;
    email_verified: string;
    azp?: string;
    name?: string;
    picture?: string;
    given_name: string;
    family_name?: string;
    iat?: string;
    exp?: string;
    jti?: string;
    alg?: string;
    kid?: string;
    typ?: string;
}
const queries = {
    verifyGoogleToken: async (parent: any, { token }: { token: string }) => {
        if (!token?.trim()) {
            throw new GraphQLError("Google token is required", {
                extensions: { code: "BAD_USER_INPUT" },
            });
        }

        const googleToken = token;
        //make url 
        const googleOauthURL = new URL('https://oauth2.googleapis.com/tokeninfo')
        //set the id_token ad google token in url
        googleOauthURL.searchParams.set('id_token', googleToken)
        
        let data: GoogleTokenResult;
        try {
            //make request to particular url 
            const response = await axios.get<GoogleTokenResult>(googleOauthURL.toString(), {
                responseType: 'json'
            });
            data = response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 400) {
                throw new GraphQLError("Invalid or expired Google token", {
                    extensions: { code: "UNAUTHENTICATED" },
                });
            }

            throw new GraphQLError("Failed to verify Google token", {
                extensions: { code: "INTERNAL_SERVER_ERROR" },
            });
        }

        if (!data?.email) {
            throw new GraphQLError("Google account email not available", {
                extensions: { code: "BAD_USER_INPUT" },
            });
        }

        //console.log(data);

        //check if the user exist in db or not 
        const user = await prismaClient.user.findUnique({ where: { email: data.email }, });

        //if no user create one
        if (!user) {
            await prismaClient.user.create({
                data: {
                    email: data.email,
                    firstName: data.given_name,
                    lastName: data.family_name,
                    profileImageURL : data.picture
                }
            })
        }
        //generate token for new user using jsonwebtoken
        const userInDb = await prismaClient.user.findUnique({ where: { email: data.email } });
        if (!userInDb) throw new Error('User with Email Not Found');

        const userToken = JWTService.generateTokenForUser(userInDb);


        return userToken;
    },
};

export const resolvers = { queries };