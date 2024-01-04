import {RegisterForm} from "@features/auth/components/RegisterForm.tsx";
import {useNavigate} from "react-router-dom";
import {Head} from "@components/elements/Head.tsx";

export const RegisterPage = () => {
    const navigate = useNavigate();
    return (<>
            <Head title="Register Page"/>
            <p className="text-5xl">Register</p>
            <RegisterForm onSuccess={() => navigate('/auth/login')}/>
        </>
    )
}