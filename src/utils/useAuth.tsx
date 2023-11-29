import {useLazyGetOwnerQuery} from "@features/auth/api.ts";
import {useCallback, useEffect} from "react";

export const useAuth = () => {
    const [trigger, {data: user}] = useLazyGetOwnerQuery();

    const fetchOwner = useCallback(() =>
        trigger(null, false), [trigger]);

    useEffect(() => {
        fetchOwner();
    }, [fetchOwner]);

    return [user, fetchOwner] as const;
}