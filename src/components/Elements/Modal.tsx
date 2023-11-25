import {ReactNode} from "react";
import clsx from "clsx";

const sizes = {
    xl: 'modal-xl',
    lg: 'modal-lg',
    sm: 'modal-sm'
};


type ModalProps = {
    title: string;
    id: string
    children: ReactNode,
    variant?: keyof typeof sizes;
};

export const Modal = ({title, id, children, variant}: ModalProps) => {

    return (<div className={clsx("modal fade", variant)} id={id} tabIndex={-1}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5">{title}</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div className="modal-body">
                        {children}
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" className="btn btn-primary">Save changes</button>
                    </div>
                </div>
            </div>
        </div>
    )
}