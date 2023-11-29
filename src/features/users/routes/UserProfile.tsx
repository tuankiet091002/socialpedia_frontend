import {
    useAddFriendMutation,
    useDeleteFriendMutation,
    useGetOneUserQuery,
    UserProfileUpdateRequest,
    UserResponse,
    useUpdateUserMutation
} from "@features/users";
import {useParams} from "react-router-dom";
import {Avatar, Button} from "@components/Elements";
import {z} from "zod";
import {Form, InputField} from "@components/Form";
import {SelectField} from "@components/Form/SelectField.tsx";
import {useState} from "react";
import {useAuth} from "@utils/useAuth.tsx";
import {ErrorResponse} from "@src/types.ts";

const schema = z.object({
    name: z.string().min(1, 'Name is required'),
    dob: z.preprocess((value) => new Date(value ? z.string().parse(value) : 0).toLocaleDateString('en-GB'), z.string().min(1, 'Date is required.')),
    phone: z.string().regex(new RegExp("^0\\d{9}$"), "Phone must start with 0 and have 10 characters."),
    gender: z.boolean()
})

export const UserProfile = () => {
    //// SETTING VARIABLES
    // get user email
    const {userEmail} = useParams();
    const [user, fetchOwner] = useAuth();
    const [updateUser, result] = useUpdateUserMutation();
    const [addFriend, addResult] = useAddFriendMutation();
    const [deleteFriend, deleteResult] = useDeleteFriendMutation();
    const [isEditing, setIsEditing] = useState<boolean>(false);

    // main data
    const {data} = useGetOneUserQuery(decodeURIComponent(userEmail as string));
    if (!data) return null;

    // check if friend
    const isFriend = user?.friends ? user.friends.some((f: UserResponse) => f.id === data.id) : false;

    // friend handler
    const handleAddFriend = () => {
        // if success, fetch the user again
        addFriend(data.id).then(fetchOwner);
        window.alert("Friend added successfully.")
    }

    const handleUnfriend = () => {
        deleteFriend(data.id).then(fetchOwner);
        window.alert("Unfriend successfully.")
    }


    return (
        <div className="container">
            <Avatar src={data.avatar.url} size="lg"/>
            <Form<UserProfileUpdateRequest, typeof schema>
                onSubmit={async (value: UserProfileUpdateRequest) => {
                    updateUser({...value, id: data.id})
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
                        </div>
                        {
                            isFriend ? <Button type="button" className="w-full btn-danger"
                                               onClick={handleUnfriend}
                                               isLoading={addResult.isLoading}> Unfriend </Button>
                                : <Button type="button" className="w-full"
                                          onClick={handleAddFriend}
                                          isLoading={deleteResult.isLoading}> Add Friend </Button>

                        }
                    </>
                )}
            </Form>

        </div>
    )
}