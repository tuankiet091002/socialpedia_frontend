import {z} from "zod";
import {Link} from "react-router-dom";
import {ErrorResponse} from "@src/types.ts";
import {useLoginMutation} from "@features/auth/api.ts";
import {Form} from "@components/form/Form.tsx";
import {InputField} from "@components/form/InputField.tsx";
import {Button} from "@components/elements/Button.tsx";
import {LoginRequest} from "@features/auth/types/LoginRequest.ts";

const schema = z.object({
    email: z.string().min(1, "Email is required.").email("Wrong email format."),
    password: z.string().min(1, "Password must at least 6 character.")
});

type LoginFormProps = {
    onSuccess: () => void;
};

export const LoginForm = ({onSuccess}: LoginFormProps) => {
    const [login, result] = useLoginMutation();

    return (<div>
        <Form<LoginRequest, typeof schema>
            onSubmit={async (values: LoginRequest) => {
                login(values).unwrap().then(onSuccess);
            }}
            schema={schema}
        >
            {({register, formState}) => (
                <>
                    <InputField
                        type="text"
                        label="Email Address"
                        error={formState.errors["email"]}
                        registration={register("email")}
                    />
                    <InputField
                        type="password"
                        label="Password"
                        error={formState.errors["password"]}
                        registration={register("password")}
                    />
                    {result.isError && <p className="text-start text-red-500">{(result.error as {
                        data: ErrorResponse
                    }).data.message}</p>}
                    <div className="flex justify-center">
                        <Button type="submit" size="md" isLoading={result.isLoading} className="mt-3">
                            Log in
                        </Button>
                    </div>
                </>
            )}
        </Form>

        <p className="text-end text-sm">
            Don't have account yet?&nbsp;
            <Link to="../register" className="font-medium text-blue-600 hover:text-blue-500">
                Register
            </Link>
        </p>
    </div>);
};