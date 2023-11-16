import React from "react";

type ChannelColumnHeaderProps = {
    setName: React.Dispatch<React.SetStateAction<string | undefined>>
}

export const ChannelColumnHeader = ({setName}: ChannelColumnHeaderProps) => {

    return (<div className="container" style={{backgroundColor: "yellow"}}>
            <div className="d-flex align-items-center justify-content-between">
                <h2>Chat</h2>
            </div>
            <form>
                <input type="email" className="form-control" placeholder="Find Channel"
                       style={{height: "35px"}} onChange={(e) => setName(e.target.value)}/>
            </form>
        </div>
    )
}