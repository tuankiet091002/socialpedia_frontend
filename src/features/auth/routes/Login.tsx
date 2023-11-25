import {LoginForm} from "@features/auth/components/LoginForm.tsx";
import {useNavigate} from "react-router-dom";
import {Head} from "@components/Elements/Head.tsx";

export const Login = () => {
    const navigate = useNavigate();

    return (<>
        <Head title="Login"/>
        <h3>Login</h3>
        <LoginForm onSuccess={() => {
            navigate('/messages')
        }}/>
    </>);
}