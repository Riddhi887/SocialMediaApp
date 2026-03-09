//create all the queries here 
//1st query to verify token provided and will provide my generated token
export const queries = `
    verifyGoogleToken(token: String!): String

    #return current user if header have token
    getCurrentUser : User
`;