import {Modal} from "@components/Modal";

export const ChatInput = () => {
    return (<div>
        <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#ligliglig">
            Launch demo modal
        </button>
        <Modal title="Model test" id="ligliglig">
            Ligma Ball
        </Modal>
    </div>)
}