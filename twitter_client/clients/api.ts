import { GraphQLClient } from "graphql-request"; 

const isClient = typeof window !== 'undefined'; //if server side rendered page then the Bearer token become false 

export const graphqlClient = new GraphQLClient("http://localhost:8000/graphql", {

    //this snippet must only be rendered if you are on client 
    headers: () => ({
    authorization: localStorage.getItem("__twitter_token") 
      ? `Bearer ${localStorage.getItem("__twitter_token")}`
      : "",
    }),
        

});