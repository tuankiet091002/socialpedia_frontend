import {LoginForm} from "@features/auth/components/LoginForm.tsx";
import {useNavigate} from "react-router-dom";
import {Head} from "@components/elements/Head.tsx";
import avatar from "@assets/Logomark.svg";

export const LoginPage = () => {
    const navigate = useNavigate();

    return (<>
        <Head title="Login Page"/>
        <div className="mb-2 text-start">
            <img className="mr-3 inline-block h-12 w-12 rounded-full" src={avatar} alt="Rounded avatar"/>
            <span className="text-2xl dark:text-white">Socialpedia</span>
        </div>
        <p className="text-start text-5xl">Welcome back!</p>
        <p className="text-start text-lg text-gray-400">Start your website in seconds. Fill your login form. </p>
        <div className="pt-[50px]">
            <LoginForm onSuccess={() => {
                navigate('/')
            }}/>
        </div>

    </>);
}