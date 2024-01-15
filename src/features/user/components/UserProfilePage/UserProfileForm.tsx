import {UserProfileRequest, UserResponse} from "@features/user/types";
import {InputField} from "@components/form/InputField.tsx";
import {SelectField} from "@components/form/SelectField.tsx";
import {ErrorResponse} from "@src/types.ts";
import {Button} from "@components/elements/Button.tsx";
import {Form} from "@components/form/Form.tsx";
import {useUpdateProfileMutation} from "@features/auth/api.ts";
import {z} from "zod";
import {Dispatch, SetStateAction} from "react";
import {AiOutlineProfile} from "react-icons/ai";

type ProfileFormProps = {
    data: UserResponse
    edit: boolean
    setEdit?: Dispatch<SetStateAction<boolean>>
}

const schema = z.object({
    name: z.string().min(1, "Name is required"),
    dob: z.preprocess((value) => new Date(value ? z.string().parse(value) : 0).toLocaleDateString("en-GB"), z.string().min(1, "Date is required.")),
    phone: z.string().regex(new RegExp("^0\\d{9}$"), "Phone must start with 0 and have 10 characters."),
    gender: z.preprocess((value) => JSON.parse(value as string), z.boolean())
});

export const UserProfileForm = ({data, edit, setEdit}: ProfileFormProps) => {

    // setting hook
    const [updateProfile, result] = useUpdateProfileMutation();

    return (<>
        <Form<UserProfileRequest, typeof schema>
            onSubmit={async (value: UserProfileRequest) => {
                updateProfile(value).unwrap()
                    .then(() => {
                            if (setEdit) {
                                setEdit(false);
                            }
                            window.alert("Profile updated successfully!");
                        }
                    );
            }}
            options={{
                defaultValues: {
                    name: data.name,
                    phone: data.phone,
                    gender: data.gender,
                    dob: data.dob
                }
            }}
            schema={schema}
        >
            {({register, formState}) => (
                <div className="rounded-md border-gray-300 p-6 text-start shadow-xl">
                    <AiOutlineProfile className="mr-3 inline text-4xl text-blue-500"/>
                    <span className="align-sub text-lg font-semibold">Personal Information:</span>
                    <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
                        <InputField
                            type="text"
                            label="Fullname:"
                            error={formState.errors["name"]}
                            registration={{...register("name"), disabled: !edit}}
                            className="w-5/6 text-lg disabled:border-none"
                        />
                        <InputField
                            type="text"
                            label="Phone Number:"
                            error={formState.errors["phone"]}
                            registration={{...register("phone"), disabled: !edit}}
                            className="w-5/6 text-lg disabled:border-none"
                        />
                        <InputField
                            type="date"
                            label="Birthdate:"
                            error={formState.errors["dob"]}
                            registration={{...register("dob"), disabled: !edit}}
                            className="w-5/6 text-lg disabled:border-none"
                        />
                        <SelectField
                            label="Gender:"
                            error={formState.errors["gender"]}
                            registration={{...register("gender"), disabled: !edit}}
                            options={[
                                {label: "Male", value: "true"},
                                {label: "Female", value: "false"}
                            ]}
                            className="w-5/6 text-lg [&>option]:text-lg"
                        />

                        {result.isError && <span className="text-sm text-red-500">
                            {(result.error as { data: ErrorResponse }).data.message}
                        </span>}

                    </div>
                    {edit &&
                        <div className="mt-5 flex items-center justify-center space-x-3">
                            <Button type="submit" isLoading={result.isLoading}>
                                Save
                            </Button>
                            <Button type="button" variant="danger"
                                    onClick={() => setEdit && setEdit(false)}>
                                Cancel
                            </Button>
                        </div>}
                </div>
            )}
        </Form>
    </>);
};