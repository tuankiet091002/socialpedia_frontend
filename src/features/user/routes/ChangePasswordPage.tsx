import {Head} from "@components/elements/Head.tsx";
import {PasswordForm} from "@features/user/components/UserProfilePage/PasswordForm.tsx";

export const ChangePasswordPage = () => {

    return (<>
        <Head title="Password Form Page"/>
        <h3>Change Password</h3>
        <PasswordForm onSuccess={() => {
            console.log("Done")
        }}/>
    </>);
}
