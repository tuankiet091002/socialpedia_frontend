import {useNavigate} from "react-router-dom";
import {Head} from "@components/elements/Head.tsx";
import {RegisterForm} from "@features/auth/components/RegisterForm.tsx";

export const ForgetPasswordPage = () => {
    const navigate = useNavigate();
    return (<>
            <Head title="RegisterPage"/>
            <h3>Forget Password</h3>
            <RegisterForm onSuccess={() => navigate('/auth/login')}/>
        </>
    )
}