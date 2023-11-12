import {z} from "zod";
import {Form, InputField} from "@components/Form";
import {Button} from "@components/Elements";
import {Link} from "react-router-dom";

const schema = z.object({
    email: z.string().min(1, 'Email is required.').email('Wrong email format.'),
    name: z.string().min(1, 'Name is required'),
    password: z.string().min(6, 'Password must at least 6 character.'),
})

type RegisterValues = {
    email: string,
    name: string,
    password: string
}

type RegisterFormProp = {
    onSuccess: () => void;
};

export const RegisterForm = ({onSuccess}: RegisterFormProp) => {
    return (<div>
        <Form<RegisterValues, typeof schema>
            onSubmit={async () => {
                onSuccess();
            }}
            schema={schema}
        >
            {({register, formState}) => (
                <>
                    <InputField
                        id="registerEmail"
                        type="text"
                        label="Email Address"
                        error={formState.errors['email']}
                        registration={register('email')}
                    />
                    <InputField
                        id="registerName"
                        type="text"
                        label="Fullname"
                        error={formState.errors['name']}
                        registration={register('name')}
                    />
                    <InputField
                        id="registerPassword"
                        type="password"
                        label="Password"
                        error={formState.errors['password']}
                        registration={register('password')}
                    />
                    <div className="p-3 d-flex align-items-center justify-content-center">
                        <Button type="submit" className="w-full">
                            Register
                        </Button>
                    </div>
                </>
            )}
        </Form>
        <div className="mt-2 flex items-center justify-end">
            <div className="text-sm">
                <Link to="../login" className="font-medium text-blue-600 hover:text-blue-500">
                    Already have an account? Login
                </Link>
            </div>
        </div>
    </div>)
}