//resolvers for all token
//1st resolver : you'll get a token

const queries = {
    verifyGoogleToken: async (parent: any, { token }: { token: string }) => {
        return token;
    },
};

export const resolvers = { queries };