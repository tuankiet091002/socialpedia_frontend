import {z} from "zod";
import {useUpdatePasswordMutation} from "@features/auth/api.ts";
import {Form} from "@components/form/Form.tsx";
import {InputField} from "@components/form/InputField.tsx";
import {ErrorResponse} from "@src/types.ts";
import {Button} from "@components/elements/Button.tsx";
import {UserPasswordRequest} from "@features/auth/types/UserPasswordRequest.ts";

const schema = z.object({
    oldPassword: z.string().min(1, "Password must at least 6 character."),
    newPassword: z.string().min(1, "Password must at least 6 character.")
})

type PasswordFormProps = {
    onSuccess: () => void;
};

export const PasswordForm = ({onSuccess}: PasswordFormProps) => {
    const [updatePassword, result] = useUpdatePasswordMutation();

    if (result.isSuccess) onSuccess();

    return (
        <Form<UserPasswordRequest, typeof schema>
            onSubmit={async (values: UserPasswordRequest) => {
                updatePassword(values).unwrap()
                    .then(() => {
                        window.alert("Password changed successfully!")
                        onSuccess();
                    });
            }}
            schema={schema}
        >
            {({register, formState}) => (
                <>
                    <InputField
                        type="password"
                        label="Old Password"
                        error={formState.errors["oldPassword"]}
                        registration={register("oldPassword")}
                    />
                    <InputField
                        type="password"
                        label="New Password"
                        error={formState.errors["newPassword"]}
                        registration={register("newPassword")}
                    />
                    {result.isError && <span className="text-sm text-red-500">
                            {(result.error as { data: ErrorResponse }).data.message}
                        </span>}
                    <div className="p-3 d-flex align-items-center justify-content-center">
                        <Button type="submit" className="w-full" isLoading={result.isLoading}>
                            Change Password
                        </Button>
                    </div>
                </>
            )}
        </Form>
    )
}