import {Dispatch, SetStateAction} from "react";

type InboxColumnHeaderProps = {
    setName: Dispatch<SetStateAction<string | undefined>>
}

export const InboxColumnHeader = ({setName}: InboxColumnHeaderProps) => {

    return (<div className="container" style={{backgroundColor: "yellow"}}>
            <div className="d-flex align-items-center justify-content-between">
                <h2>Inbox Chat</h2>
            </div>
            <form>
                <input type="text" className="form-control" placeholder="Find Channel"
                       style={{height: "35px"}} onChange={(e) => setName(e.target.value)}/>
            </form>
        </div>
    )
}