
import { graphql } from "../../gql";

export const verifygoogleTokenUserQuery = graphql(`
    #graphql

    query VerifyUserGoogleToken($token: String!){
     verifyGoogleToken(token: $token)
    }

`);