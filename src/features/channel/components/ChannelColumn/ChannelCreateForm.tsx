import {ChangeEvent, Dispatch, SetStateAction, useState} from "react";
import {RxCross2} from "react-icons/rx";
import emptyAvatar from "@assets/empty avatar.jpg";
import {FaPlus} from "react-icons/fa";
import {Button} from "@components/elements/Button.tsx";
import {ChannelCreateRequest} from "@features/channel/types/ChannelCreateRequest.ts";
import {ChannelCreateFormMember} from "@features/channel/components/ChannelColumn/ChannelCreateFormMember.tsx";

export type ChannelCreateFormProps = {
    setShow: Dispatch<SetStateAction<boolean>>
}

export const ChannelCreateForm = ({setShow}: ChannelCreateFormProps) => {

    const [stage, setStage] = useState<number>(0);
    const [error, setError] = useState<string>();
    // form content in a pack
    const [form, setForm] = useState<ChannelCreateRequest>({
        name: "",
        description: "",
        avatarFile: undefined,
        channelMembersId: []
    });

    // handler for buttons
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setForm(f => ({...f, avatarFile: (e.target.files)![0]}));
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm(f => ({...f, [e.target.name]: e.target.value}));
    };


    const handleNextStage = () => {
        if (stage == 0) {
            if (form.name == "") {
                setError("Channel name is required.");
                return;
            }
        } else if (stage == 1) {
            if (form.description == "") {
                setError("Channel description is required.");
                return;
            }
        }
        setError("");
        setStage(s => s + 1);
    };

    const handlePreviousStage = () => {
        setError("");
        setStage(s => s - 1);
    };

    const handleSubmit = () => {
        console.log(form);
    };

    return (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-gray-900/[.7]">
            <div
                className="z-50 flex flex-col items-stretch gap-y-4 rounded-lg bg-white p-4 opacity-100 h-[400px] w-[600px]">
                <div className="flex flex-row items-center justify-between">
                    <div className="w-12"></div>
                    <p className="text-center text-3xl">Create Your Channel</p>
                    <RxCross2
                        className="w-12 cursor-pointer rounded-full bg-gray-200 p-1 text-4xl hover:bg-gray-300"
                        onClick={() => setShow(false)}/>
                </div>
                {stage == 0 ? <section className="h-full">
                        <label htmlFor="createChannelFile"
                               className="relative flex cursor-pointer flex-col items-center justify-center gap-y-2">
                            <img src={form.avatarFile ? URL.createObjectURL(form.avatarFile) : emptyAvatar}
                                 className="rounded-full border-gray-300 border-[5px] h-[150px] w-[150px]" alt=""/>
                            <FaPlus
                                className="rounded-full border-[3px] border-blue-600 bg-blue-600 text-3xl text-white absolute top-1.5 right-[calc(50%-65px)]"/>
                            <p className="font-semibold">{form.avatarFile?.name || "\u00a0"}</p>
                            <input
                                id="createChannelFile"
                                type="file"
                                className="hidden rounded-md bg-white px-2.5 py-1.5 text-sm text-gray-900 border border-gray-300
                                shadow-sm hover:bg-gray-100"
                                onChange={handleFileChange}
                            />
                        </label>
                        <div className="px-[80px]">
                            <label htmlFor="channelCreateName" className="block text-start text-md">Channel name:</label>
                            <input type="text" id="channelCreateName" name="name"
                                   className="w-full flex-auto appearance-none rounded-md border border-gray-300 px-2 py-1 text-xl shadow-sm placeholder-gray-400 focus:outline-none"
                                   placeholder="Enter channel name"
                                   value={form.name}
                                   onChange={handleChange}/>
                            <div role="alert" className="text-start text-sm text-red-500">
                                {error}
                            </div>
                        </div>
                    </section> :
                    stage == 1 ? <section className="h-full p-6">
                            <label htmlFor="channelCreateDesc" className="block text-start text-md">
                                Channel description:
                            </label>
                            <textarea id="channelCreateDesc"
                                      name="description"
                                      className="block h-full w-full appearance-none rounded-md border border-gray-300 px-3 py-2 shadow-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                                      placeholder="Enter channel description"
                                      value={form.description}
                                      onChange={handleChange}
                            />
                            <div role="alert" className="text-start text-sm text-red-500">
                                {error}
                            </div>
                        </section>
                        : <section className="h-full">
                            <ChannelCreateFormMember form={form} setForm={setForm}/>
                        </section>}
                <section className="flex justify-end gap-x-4">
                    {stage > 0 &&
                        <Button type="button" variant="danger" onClick={handlePreviousStage}>Back</Button>}
                    {stage == 2 ?
                        <Button type="button" onClick={handleSubmit}>Done</Button>
                        : <Button type="button" onClick={handleNextStage}>Next</Button>}
                </section>

            </div>
        </div>
    );
};