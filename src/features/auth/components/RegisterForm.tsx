import {z} from "zod";

import {SelectField} from "@components/form/SelectField.tsx";
import {ChangeEvent, useState} from "react";
import {useRegisterMutation} from "@features/auth/api.ts";
import {Form} from "@components/form/Form.tsx";
import {InputField} from "@components/form/InputField.tsx";
import {Button} from "@components/elements/Button.tsx";
import {Link} from "react-router-dom";
import {RegisterRequest} from "@features/auth/types/RegisterRequest.ts";
import {ErrorResponse} from "@src/types.ts";

const schema = z.object({
    email: z.string().min(1, "Email is required.").email("Wrong email format."),
    name: z.string().min(1, "Name is required."),
    password: z.string().min(1, "Password is required."),
    phone: z.string().regex(new RegExp("^0\\d{9}$"), "Phone must start with 0 and have 10 characters."),
    dob: z.preprocess((value) => new Date(value ? z.string().parse(value) : 0).toLocaleDateString("en-GB"), z.string().min(1, "Date is required.")),
    gender: z.enum(["true", "false"])
});

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
                register({...value, file}).unwrap().then(onSuccess);
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
                        type="text"
                        label="Fullname"
                        error={formState.errors["name"]}
                        registration={register("name")}
                    />
                    <InputField
                        type="password"
                        label="Password"
                        error={formState.errors["password"]}
                        registration={register("password")}
                    />
                    <InputField
                        type="text"
                        label="Phone Number"
                        error={formState.errors["phone"]}
                        registration={register("phone")}
                    />
                    <InputField
                        type="date"
                        label="Date of Birth"
                        error={formState.errors["dob"]}
                        registration={register("dob")}
                    />
                    <SelectField
                        label="Gender"
                        error={formState.errors["gender"]}
                        registration={register("gender")}
                        options={[
                            {label: "Male", value: "true"},
                            {label: "Female", value: "false"}
                        ]}
                    />
                    <div className="col-span-full">
                        <p className="block text-start text-sm text-gray-800">Avatar</p>
                        <div className="mt-2 flex items-center gap-x-3">
                            {file ?
                                <img className="h-12 w-12 rounded-full" src={URL.createObjectURL(file)}
                                     alt="Preview image"/> :
                                <svg className="h-12 w-12 text-gray-300" viewBox="0 0 24 24" fill="currentColor"
                                     aria-hidden="true">
                                    <path fillRule="evenodd"
                                          d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615
                                      2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0
                                      006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224
                                      8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75
                                      3.75 0 017.5 0z"
                                          clipRule="evenodd"/>
                                </svg>}
                            <label htmlFor="registerFile"
                                   className="flex justify-center items-center border border-gray-300 rounded-md 
                                   shadow-sm font-medium focus:outline-none hover:opacity-80 bg-gray-300 px-3 cursor-pointer">
                                Select Image
                            </label>
                            {file && file.name}
                            <input
                                id="registerFile"
                                type="file"
                                className="hidden"
                                onChange={handleFileChange}
                            />

                        </div>
                    </div>

                    {result.isError && <p className="text-start text-red-500">{(result.error as {
                        data: ErrorResponse
                    }).data.message}</p>}
                    <div className="mt-3 flex items-center justify-center">
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
    </div>);
};