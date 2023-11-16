import {AuthLayout} from "@features/auth/components/AuthLayout.tsx";
import {RegisterForm} from "@features/auth/components/RegisterForm.tsx";

export const Register = () => (
    <AuthLayout title="Register Form">
        <RegisterForm onSuccess={() => console.log("Success")}/>
    </AuthLayout>
)