import {z} from "zod";
import {Form, InputField} from "@components/Form";
import {Button} from "@components/Elements";
import {Link} from "react-router-dom";
import {RegisterRequest, ROLES, useRegisterMutation} from "@features/auth";
import {SelectField} from "@components/Form/SelectField.tsx";
import {ChangeEvent, useState} from "react";

const schema = z.object({
    email: z.string().min(1, 'Email is required.').email('Wrong email format.'),
    name: z.string().min(1, 'Name is required'),
    password: z.string().min(1, 'Password is required.'),
    phone: z.string().regex(new RegExp("^0\\d{9}$"), "Phone must start with 0 and have 10 characters."),
    dob: z.preprocess((value) => new Date(value ? z.string().parse(value) : 0).toLocaleDateString('en-GB'), z.string().min(1, 'Date is required.')),
    role: z.string(),
    gender: z.preprocess((value) => z.string().parse(value) == "true", z.boolean()),
})

type RegisterFormProp = {
    onSuccess: () => void;
};

export const RegisterForm = ({onSuccess}: RegisterFormProp) => {
    const [register, result] = useRegisterMutation();

    const [file, setFile] = useState<File>();

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };


    return (<div>
        <Form<RegisterRequest, typeof schema>
            onSubmit={async (value: RegisterRequest) => {
                register({...value, file});
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
                    <InputField
                        id="registerPhone"
                        type="text"
                        label="Phone Number"
                        error={formState.errors['phone']}
                        registration={register('phone')}
                    />
                    <InputField
                        id="registerDob"
                        type="date"
                        label="Date of Birth"
                        error={formState.errors['dob']}
                        registration={register('dob')}
                    />
                    <SelectField
                        id="registerRole"
                        label="Role"
                        error={formState.errors['role']}
                        registration={register('role')}
                        options={Object.keys(ROLES).map(
                            role => ({
                                label: role.toString(),
                                value: ROLES[role as keyof typeof ROLES]
                            })
                        )
                        }
                    />
                    <SelectField
                        id="regiserGender"
                        label="Gender"
                        error={formState.errors['gender']}
                        registration={register('gender')}
                        options={[
                            {label: "Male", value: "true"},
                            {label: "Female", value: "false"}
                        ]}
                    />
                    <input
                        id="registerAvatar"
                        type="file"
                        className="form-control"
                        onChange={handleFileChange}
                    />
                    {result.isError && result.error.data?.message}
                    <div className="p-3 d-flex align-items-center justify-content-center">
                        <Button type="submit" isLoading={result.isLoading}>
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