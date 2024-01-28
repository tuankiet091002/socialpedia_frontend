import {cloneElement, ReactElement, useEffect} from "react";
import {FaExclamationTriangle} from "react-icons/fa";
import {IoMdInformationCircle} from "react-icons/io";
import {Button} from "@components/elements/Button.tsx";
import {useDisclosure} from "@src/hooks/useDisclosure.ts";
import {createPortal} from "react-dom";

type ConfirmationDialogProps = {
    triggerButton: ReactElement;
    confirmButton: ReactElement;
    title: string;
    body?: string;
    cancelButtonText?: string;
    type?: "danger" | "info";
    isDone?: boolean;
}

export const ConfirmationDialog = ({
                                       triggerButton,
                                       confirmButton,
                                       title,
                                       body = "",
                                       cancelButtonText = "Cancel",
                                       type = "danger",
                                       isDone = false
                                   }: ConfirmationDialogProps) => {

    const {close, open, isOpen} = useDisclosure();

    useEffect(() => {
        if (isDone) {
            close();
        }
    }, [isDone, close]);

    // clone plain button and add new prop
    const trigger = cloneElement(triggerButton, {
        onClick: open
    });


    return (<>
        {trigger}
        {isOpen && createPortal(<div
            className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm">
            <div
                className="z-50 m-4 overflow-y-auto rounded-md bg-white px-4 py-2 shadow-lg max-h-[80%] lg:max-w-[40%]">
                <div className="flex flex-col items-center space-x-2 space-y-2 lg:flex-row">
                    <div
                        className="flex flex-shrink-0 items-center justify-center rounded-full bg-gray-200 h-[60px] w-[60px]">
                        {type === "danger" ?
                            <FaExclamationTriangle className="text-red-600 h-[50px] w-[50px]"/> :
                            <IoMdInformationCircle className="text-blue-600 h-[50px] w-[50px]"/>}
                    </div>

                    {body && <div className="text-center lg:text-left">
                        <p className="text-2xl font-bold">{title}!</p>
                        <p className="text-base text-gray-700">
                            {body}
                        </p>
                    </div>}
                </div>
                <hr className="my-2 bg-gray-400"/>
                <div className="flex justify-end gap-x-2 text-center text-sm">
                    <Button variant={type == "danger" ? "primary" : "danger"} onClick={close}>
                        {cancelButtonText}
                    </Button>
                    {confirmButton}
                </div>
            </div>
        </div>, document.querySelector("div#modal")!)}
    </>);
}