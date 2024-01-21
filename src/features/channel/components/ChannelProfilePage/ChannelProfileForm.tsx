import {InputField} from "@components/form/InputField.tsx";
import {ErrorResponse} from "@src/types.ts";
import {Button} from "@components/elements/Button.tsx";
import {Form} from "@components/form/Form.tsx";
import {z} from "zod";
import {useState} from "react";
import {ChannelResponse} from "@features/channel/types/ChannelResponse.ts";
import {useUpdateChannelProfileMutation} from "@features/channel/api.ts";
import {ChannelProfileRequest} from "@features/channel/types/ChannelProfileRequest.ts";
import {TextareaField} from "@components/form/TextareaField.tsx";

type ChannelProfileFormProps = {
    data: ChannelResponse;
    edit: boolean;
}

const schema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().min(1, "Description is required")
})

export const ChannelProfileForm = ({data, edit}: ChannelProfileFormProps) => {

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
                    description: data.description
                }
            }}
            schema={schema}
        >
            {({register, formState}) => (
                <>
                    <InputField
                        type="text"
                        label="Fullname:"
                        error={formState.errors["name"]}
                        registration={{...register("name"), disabled: !isEditing}}
                        className="w-5/6 text-lg disabled:border-none"
                    />
                    <TextareaField
                        label="Description:"
                        error={formState.errors["description"]}
                        registration={{...register("description"), disabled: !isEditing}}
                        className="w-5/6 !text-lg    disabled:border-none h-[250px]"
                    />
                    {result.isError && <span className="text-sm text-red-500">
                        {(result.error as { data: ErrorResponse }).data.message}
                    </span>}

                    {edit && isEditing &&
                        <div className="mt-5 flex items-center justify-center space-x-3">
                            <Button type="submit" isLoading={result.isLoading}>
                                Save
                            </Button>
                            <Button type="button" variant="danger"
                                    onClick={() => setIsEditing(false)}>
                                Cancel
                            </Button>
                        </div>}
                </>
            )}
        </Form>
    </>);
}