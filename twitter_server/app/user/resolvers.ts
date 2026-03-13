//resolvers for all token
//1st resolver : you'll get a token
import axios from "axios";
import { GraphQLError } from "graphql";
import { prismaClient } from "../../src/clients/db";
import JWTService from "../../src/services/jwt";
import type { GraphqlContext } from "../../src/interfaces";

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

        let googleUserInfo: {
            email: string;
            given_name: string;
            family_name?: string;
            picture?: string;
        };

        try {
            const userInfoResponse = await axios.get(
                'https://www.googleapis.com/oauth2/v3/userinfo',
                { headers: { Authorization: `Bearer ${token}` } }
            );
            googleUserInfo = userInfoResponse.data;
            console.log("Google userinfo:", googleUserInfo);
        } catch (e) {
            throw new GraphQLError("Failed to verify Google token", {
                extensions: { code: "UNAUTHENTICATED" },
            });
        }

        if (!googleUserInfo?.email) {
            throw new GraphQLError("Google account email not available", {
                extensions: { code: "BAD_USER_INPUT" },
            });
        }

        const userInDb = await prismaClient.user.upsert({
            where: { email: googleUserInfo.email },
            update: {
                firstName: googleUserInfo.given_name,
                lastName: googleUserInfo.family_name ?? null,
                profileImageURL: googleUserInfo.picture ?? null,
            },
            create: {
                email: googleUserInfo.email,
                firstName: googleUserInfo.given_name,
                lastName: googleUserInfo.family_name ?? null,
                profileImageURL: googleUserInfo.picture ?? null,
            },
        });

        const userToken = JWTService.generateTokenForUser(userInDb);
        return userToken;
    },

    getCurrentUser: async (parent: any, args: any, ctx: GraphqlContext) => {
        console.log(ctx);
        const id = ctx.user?.id;
        if (!id) return null;
        const user = await prismaClient.user.findUnique({ where: { id } });
        return user;
    },
};

export const resolvers = { queries };