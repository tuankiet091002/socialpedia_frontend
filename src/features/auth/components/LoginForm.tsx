import {z} from "zod";

import {Link} from "react-router-dom";

import {ErrorResponse} from "@src/types.ts";
import {useLoginMutation} from "@features/auth/api.ts";
import {LoginRequest} from "@features/auth/types";
import {Form} from "@components/Form/Form.tsx";
import {InputField} from "@components/Form/InputField.tsx";
import {Button} from "@components/Elements/Button.tsx";

const schema = z.object({
    email: z.string().min(1, 'Email is required.').email('Wrong email format.'),
    password: z.string().min(1, 'Password must at least 6 character.')
})

type LoginFormProps = {
    onSuccess: () => void;
};

export const LoginForm = ({onSuccess}: LoginFormProps) => {
    const [login, result] = useLoginMutation();

    if (result.isSuccess) onSuccess();

    return (<div>
        <Form<LoginRequest, typeof schema>
            onSubmit={async (values: LoginRequest) => {
                login(values)
            }}
            schema={schema}
        >
            {({register, formState}) => (
                <>
                    <InputField
                        id="loginEmail"
                        type="text"
                        label="Email Address"
                        error={formState.errors['email']}
                        registration={register('email')}
                    />
                    <InputField
                        id="loginPassword"
                        type="password"
                        label="Password"
                        error={formState.errors['password']}
                        registration={register('password')}
                    />
                    {result.isError && (result.error as { data: ErrorResponse }).data.message}
                    <div className="p-3 d-flex align-items-center justify-content-center">
                        <Button type="submit" className="w-full" isLoading={result.isLoading}>
                            Log in
                        </Button>
                    </div>
                </>
            )}
        </Form>
        <div className="mt-2 flex items-center justify-end">
            <div className="text-sm">
                <Link to="../register" className="font-medium text-blue-600 hover:text-blue-500">
                    Don't have account yet? Register
                </Link>
            </div>
        </div>
    </div>)
};