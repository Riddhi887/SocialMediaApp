//resolvers for all token
//1st resolver : you'll get a token
import axios, { Axios } from "axios";  //for api calling 
const queries = {
    verifyGoogleToken: async (parent: any, { token }: { token: string }) => {
        const googleToken = token;
        //make url 
        const googleOauthURL = new URL('https://oauth2.googleapis.com/tokeninfo')
        //set the id_token ad google token in url
        googleOauthURL.searchParams.set('id_token', googleToken)
        
        //make request to particular url 
        const { data} = await axios.get(googleOauthURL.toString(), {
            responseType: 'json'
        })
        console.log("User Data : " + data);
        return "ok";
    },
};

export const resolvers = { queries };