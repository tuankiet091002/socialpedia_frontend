import {Head} from "@components/elements/Head.tsx";
import {PasswordForm} from "@features/user/components/UserProfilePage/PasswordForm.tsx";
import {useNavigate} from "react-router-dom";

export const ChangePasswordPage = () => {
    const navigate = useNavigate();
    return (<>
        <Head title="Password Change Page"/>
        <div className="w-1/2 mx-auto my-2">
            <p className="text-5xl">Change Password</p>
            <PasswordForm onSuccess={
                () => navigate("/user/profile")
            }/>
        </div>
    </>);
}
