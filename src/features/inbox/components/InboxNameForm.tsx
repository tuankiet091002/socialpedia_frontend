import {useUpdateInboxProfileMutation} from "@features/inbox/api.ts";
import {InboxResponse} from "@features/inbox/types/InboxResponse.ts";
import {useState} from "react";
import {IndependentInput} from "@components/elements/IndependentInput.tsx";
import {IoMdSettings} from "react-icons/io";
import {ConfirmationDialog} from "@components/dialog/ConfirmationDialog.tsx";
import {Button} from "@components/elements/Button.tsx";
import {ErrorResponse} from "@src/types.ts";

type InboxNameFormProps = {
    data: InboxResponse
}

export const InboxNameForm = ({data}: InboxNameFormProps) => {
    const [updateInbox, result] = useUpdateInboxProfileMutation();
    const [name, setName] = useState<string>(data.name);
    const [edit, setEdit] = useState<boolean>(false);

    return (<section className="flex items-center justify-items-start gap-1">
        <div>
            <IndependentInput className="w-[500px]" disabled={!edit} textSize="lg" value={name} maxLength={50}
                              onChange={e => setName(e.target.value)}/>
            {result.isError && <span className="text-start text-red-500">{(result.error as {
                data: ErrorResponse
            }).data.message}</span>}
        </div>

        {!edit ?
            <IoMdSettings className="mx-2 text-3xl hover:text-blue-500"
                          onClick={() => setEdit(true)}/> :
            <div className="flex flex-row justify-items-start gap-1 items-centers">
                <ConfirmationDialog
                    title="Change member role"
                    type="info"
                    body="Are you sure you want to change this member's role in the scope of this channel"
                    isDone={result.isSuccess}
                    triggerButton={<Button size="sm" disabled={!name.length || name == data.name}>Save</Button>}
                    confirmButton={
                        <Button type="button" size="sm" isLoading={result.isLoading}
                                onClick={() => {
                                    updateInbox({
                                        userId: data.contactWith.id,
                                        isActive: true,
                                        name: name
                                    }).unwrap().then(() => {
                                        window.alert("Inbox name updated successfully.")
                                    }).finally(() => setEdit(false))
                                }}>Save</Button>}
                />
                <Button variant="danger" size="sm"
                        onClick={() => {
                            setName(data.name);
                            setEdit(false);
                        }}>Cancel</Button>
            </div>}
    </section>)
}