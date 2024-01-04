import {InputField} from "@components/form/InputField.tsx";
import {ErrorResponse} from "@src/types.ts";
import {Button} from "@components/elements/Button.tsx";
import {Link} from "react-router-dom";
import {Form} from "@components/form/Form.tsx";
import {z} from "zod";
import {useState} from "react";
import {ChannelResponse} from "@features/channel/types/ChannelResponse.ts";
import {useUpdateChannelProfileMutation} from "@features/channel/api.ts";
import {ChannelProfileRequest} from "@features/channel/types/ChannelProfileRequest.ts";

type ChannelProfileFormProps = {
    data: ChannelResponse
}

const schema = z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().min(1, 'Description is required')
})

export const ChannelProfileForm = ({data}: ChannelProfileFormProps) => {
    const [updateChannelProfile, result] = useUpdateChannelProfileMutation();
    const [isEditing, setIsEditing] = useState<boolean>(false);

    return (<>
        <Form<ChannelProfileRequest, typeof schema>
            onSubmit={async (value: ChannelProfileRequest) => {
                updateChannelProfile({...value, channelId: data.id})
                window.alert("Profile update successfully.")
            }}
            options={{
                defaultValues: {
                    name: data.name,
                    description: data.description,
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
                        id="profileDesc"
                        type="text"
                        label="Description"
                        error={formState.errors['description']}
                        registration={{...register('description'), disabled: !isEditing}}
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
                </>
            )}
        </Form>
    </>);
}