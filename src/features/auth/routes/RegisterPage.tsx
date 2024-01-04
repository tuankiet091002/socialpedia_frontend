import {RegisterForm} from "@features/auth/components/RegisterForm.tsx";
import {useNavigate} from "react-router-dom";
import {Head} from "@components/elements/Head.tsx";

export const RegisterPage = () => {
    const navigate = useNavigate();
    return (<>
            <Head title="RegisterPage"/>
            <h3>RegisterPage</h3>
            <RegisterForm onSuccess={() => navigate('/auth/login')}/>
        </>
    )
}