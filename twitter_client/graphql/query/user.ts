export const verifygoogleTokenUserQuery = `#graphql

    query VerifyUserGoogleToken($token: String!){
     verifyGoogleToken(token: $token)
    }

`;