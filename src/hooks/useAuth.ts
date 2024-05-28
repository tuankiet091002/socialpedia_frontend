import {useGetOwnerQuery} from "@features/auth/api.ts";
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";

export const useAuth = () => {
    const navigate = useNavigate()
    const {data} = useGetOwnerQuery(null);

    useEffect(() => {
        if (!data) {
            navigate("/auth/login");
        }
    }, [navigate, data])

    return {data};
};