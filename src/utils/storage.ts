import {UserResponse} from "src/features/user/types";
import {LoginResponse} from "@features/auth/types/LoginResponse.ts";

const STORAGE_PREFIX = "socialpedia_";

const storage = {
    getToken: () => {
        return JSON.parse(window.localStorage.getItem(`${STORAGE_PREFIX}token`) as string);
    },
    getRefreshToken: () => {
        return JSON.parse(window.localStorage.getItem(`${STORAGE_PREFIX}refreshtoken`) as string);
    },
    getUser: () => {
        return JSON.parse(window.localStorage.getItem(`${STORAGE_PREFIX}user`) as string);
    },
    clearAll: () => {
        console.log("clear storage");
        window.localStorage.clear();
    },
    setLoginResponse: (value: LoginResponse) => {
        window.localStorage.clear();
        window.localStorage.setItem(`${STORAGE_PREFIX}token`, JSON.stringify(value.token));
        window.localStorage.setItem(`${STORAGE_PREFIX}refreshtoken`, JSON.stringify(value.refreshToken));
        window.localStorage.setItem(`${STORAGE_PREFIX}user`, JSON.stringify(value.user));
    },
    setToken: (value: string) => {
        window.localStorage.setItem(`${STORAGE_PREFIX}token`, JSON.stringify(value));
    },
    setUser: (value: UserResponse | undefined) => {
        window.localStorage.setItem(`${STORAGE_PREFIX}user`, JSON.stringify(value));
    }
};

export default storage;