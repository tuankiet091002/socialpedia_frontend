import {Modal} from "@components/Elements";

export const ChannelAdd = () => {
    return (<div style={{backgroundColor: "orange"}}>
        <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addChannel">
            Add Channel
        </button>
        <Modal title="Channel Form" id="addChannel">
            Channel
        </Modal>
    </div>)
}