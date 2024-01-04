import {LoginForm} from "@features/auth/components/LoginForm.tsx";
import {useNavigate} from "react-router-dom";
import {Head} from "@components/elements/Head.tsx";

export const LoginPage = () => {
    const navigate = useNavigate();

    return (<>
        <Head title="LoginPage"/>
        <h3>LoginPage</h3>
        <LoginForm onSuccess={() => {
            navigate('/messages')
        }}/>
    </>);
}