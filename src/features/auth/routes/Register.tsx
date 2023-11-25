import {RegisterForm} from "@features/auth/components/RegisterForm.tsx";
import {useNavigate} from "react-router-dom";
import {Head} from "@components/Elements/Head.tsx";

export const Register = () => {
    const navigate = useNavigate();
    return (<>
            <Head title="Register"/>
            <h3>Register</h3>
            <RegisterForm onSuccess={() => navigate('/auth/login')}/>
        </>
    )
}