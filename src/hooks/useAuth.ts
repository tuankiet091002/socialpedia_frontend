import {useGetOwnerQuery} from "@features/auth/api.ts";

export const useAuth = () => {
    const {data: user} = useGetOwnerQuery(null);

    return {user};
};