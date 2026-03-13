
import { graphql } from "../../gql";

export const verifygoogleTokenUserQuery = graphql(`
    #graphql

    query VerifyUserGoogleToken($token: String!){
     verifyGoogleToken(token: $token)
    }

`);
export const getCurrentUserQuery = graphql(`
    #graphql
    query GetCurrentUser {
      getCurrentUser {
      id
      firstName
      lastName
      email
      profileImageURL
      }
    }
`);