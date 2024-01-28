import {InputField} from "@components/form/InputField.tsx";
import {ErrorResponse} from "@src/types.ts";
import {Button} from "@components/elements/Button.tsx";
import {Form} from "@components/form/Form.tsx";
import {z} from "zod";
import {Dispatch, SetStateAction} from "react";
import {ChannelResponse} from "@features/channel/types/ChannelResponse.ts";
import {useUpdateChannelProfileMutation} from "@features/channel/api.ts";
import {ChannelProfileRequest} from "@features/channel/types/ChannelProfileRequest.ts";
import {TextareaField} from "@components/form/TextareaField.tsx";
import {ConfirmationDialog} from "@components/dialog/ConfirmationDialog.tsx";

type ChannelProfileFormProps = {
    data: ChannelResponse;
    edit: boolean;
    setEdit: Dispatch<SetStateAction<boolean>>
}

const schema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().min(1, "Description is required")
})

export const ChannelProfileForm = ({data, edit, setEdit}: ChannelProfileFormProps) => {

    const [updateChannelProfile, result] = useUpdateChannelProfileMutation();

    return (<>
        <Form<ChannelProfileRequest, typeof schema>
            id="channel-profile-form"
            onSubmit={async (value: ChannelProfileRequest) => {
                updateChannelProfile({...value, channelId: data.id}).unwrap()
                    .then(() => {
                        setEdit(false);
                        window.alert("Profile update successfully.")
                    })
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
                        registration={{...register("name"), disabled: !edit}}
                        className="w-5/6 text-lg disabled:border-none"
                    />
                    <TextareaField
                        label="Description:"
                        error={formState.errors["description"]}
                        registration={{...register("description"), disabled: !edit}}
                        className="w-5/6 !text-lg disabled:border-none h-[250px]"
                    />
                    {result.isError && <span className="text-sm text-red-500 w-[500px] text-wrap">
                        {(result.error as { data: ErrorResponse }).data.message}
                    </span>}

                    {edit &&
                        <div className="mt-5 flex items-center justify-center space-x-3">
                            <ConfirmationDialog
                                isDone={result.isSuccess}
                                type="info"
                                title="Save change"
                                body={"Are you sure you want to save change to channel?"
                                }
                                triggerButton={<Button>
                                    Save
                                </Button>}
                                confirmButton={
                                    <Button form="channel-profile-form" type="submit" isLoading={result.isLoading}>
                                        Save profile
                                    </Button>
                                }
                            />
                            <Button type="button" variant="danger"
                                    onClick={() => setEdit(false)}>
                                Cancel
                            </Button>
                        </div>}
                </>
            )}
        </Form>
    </>);
}