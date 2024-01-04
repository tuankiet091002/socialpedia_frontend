import {UserProfileRequest, UserResponse} from "@features/user/types";
import {InputField} from "@components/form/InputField.tsx";
import {SelectField} from "@components/form/SelectField.tsx";
import {ErrorResponse} from "@src/types.ts";
import {Button} from "@components/elements/Button.tsx";
import {Link} from "react-router-dom";
import {Form} from "@components/form/Form.tsx";
import {useGetOwnerQuery, useUpdateProfileMutation} from "@features/auth/api.ts";
import {useCreateFriendRequestMutation, useUnFriendMutation} from "@features/user/api.ts";
import {z} from "zod";
import {useState} from "react";

type ProfileFormProps = {
    data: UserResponse
}

const schema = z.object({
    name: z.string().min(1, 'Name is required'),
    dob: z.preprocess((value) => new Date(value ? z.string().parse(value) : 0).toLocaleDateString('en-GB'), z.string().min(1, 'Date is required.')),
    phone: z.string().regex(new RegExp("^0\\d{9}$"), "Phone must start with 0 and have 10 characters."),
    gender: z.enum(['true', 'false'])
})

export const UserProfileForm = ({data}: ProfileFormProps) => {
    const {data: user} = useGetOwnerQuery(null);
    const [updateProfile, result] = useUpdateProfileMutation();
    const [createFriendRequest, addResult] = useCreateFriendRequestMutation();
    const [unFriend, deleteResult] = useUnFriendMutation();
    const [isEditing, setIsEditing] = useState<boolean>(false);


    // check if friend
    const isFriend = user?.friends ? user.friends.some((f: UserResponse) => f.id === data.id) : false;

    // friend handler
    const handleAddFriend = () => {
        // if success, fetch the user again
        createFriendRequest(data.id);
        window.alert("Friend added successfully.")
    }

    const handleUnFriend = () => {
        // if success, fetch the user again
        unFriend(data.id);
        window.alert("Friend added successfully.")
    }


    return (<>
        <Form<UserProfileRequest, typeof schema>
            onSubmit={async (value: UserProfileRequest) => {
                updateProfile(value)
                window.alert("Profile update successfully.")
            }}
            options={{
                defaultValues: {
                    name: data.name,
                    phone: data.phone,
                    gender: data.gender,
                    dob: data.dob
                },
            }}
            schema={schema}
        >
            {({register, formState}) => (
                <>
                    <InputField
                        id="profileName"
                        type="text"
                        label="Fullname"
                        error={formState.errors['name']}
                        registration={{...register('name'), disabled: !isEditing}}
                    />
                    <InputField
                        id="profilePhone"
                        type="text"
                        label="Phone Number"
                        error={formState.errors['phone']}
                        registration={{...register('phone'), disabled: !isEditing}}
                    />
                    <InputField
                        id="profileDob"
                        type="date"
                        label="Date of Birth"
                        error={formState.errors['dob']}
                        registration={{...register('dob'), disabled: !isEditing}}
                    />
                    <SelectField
                        id="profileGender"
                        label="Gender"
                        error={formState.errors['gender']}
                        registration={{...register('gender'), disabled: !isEditing}}
                        options={[
                            {label: "Male", value: "true"},
                            {label: "Female", value: "false"}
                        ]}
                    />
                    {result.isError && (result.error as { data: ErrorResponse }).data.message}
                    <div className="p-3 d-flex align-items-center justify-content-center">
                        {isEditing && <Button type="submit" className="w-full" isLoading={result.isLoading}>
                            Save profile
                        </Button>}
                        <Button type="button" className="w-full mx-2"
                                onClick={() => setIsEditing((isEditing) => !isEditing)}>
                            {isEditing ? "Cancel" : "Edit profile"}</Button>
                        <Link to="/users/changePassword">
                            <Button type="button" className="w-full mx-2">Change password</Button>
                        </Link>
                    </div>
                    {
                        isFriend ? <Button type="button" className="w-full btn-danger"
                                           onClick={handleUnFriend}
                                           isLoading={addResult.isLoading}> Unfriend </Button>
                            : <Button type="button" className="w-full"
                                      onClick={handleAddFriend}
                                      isLoading={deleteResult.isLoading}> Add Friend </Button>

                    }
                </>
            )}
        </Form>
    </>);
}