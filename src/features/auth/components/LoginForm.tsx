import {z} from "zod";
import {Form, InputField} from "@components/Form";
import {Link} from "react-router-dom";
import {Button} from "@components/Elements";

const schema = z.object({
    email: z.string().min(1, 'Email is required.').email('Wrong email format.'),
    password: z.string().min(6, 'Password must at least 6 character.')
})

type LoginValues = {
    email: string,
    password: string
}

type LoginFormProps = {
    onSuccess: () => void;
};

export const LoginForm = ({onSuccess}: LoginFormProps) => {
    return (<div>
        <Form<LoginValues, typeof schema>
            onSubmit={async () => {
                onSuccess();
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
                    <div className="p-3 d-flex align-items-center justify-content-center">
                        <Button type="submit" className="w-full">
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