import {AuthLayout} from "@features/auth/components/AuthLayout.tsx";
import {LoginForm} from "@features/auth/components/LoginForm.tsx";

export const Login = () => {

    return (<AuthLayout title="Login Form">
        <LoginForm onSuccess={() => {
            console.log("Success")
        }}/>
    </AuthLayout>);
}