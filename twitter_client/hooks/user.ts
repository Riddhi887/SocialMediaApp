import { graphqlClient } from "@/clients/api"
import { useQuery } from "@tanstack/react-query"
import { getCurrentUserQuery } from "@/graphql/query/user"


export const useCurrentUser = () => {
    const query = useQuery({
        queryKey: ['current-user'],         //keeps the cache of the user like signin and all
        queryFn: () => graphqlClient.request(getCurrentUserQuery)
    })

    return { ...query, user: query.data?.getCurrentUser };
};