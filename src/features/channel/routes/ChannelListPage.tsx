import {ChannelList} from "@features/channel/components/ChannelList.tsx";

export const ChannelListPage = () => {

    return (<div className="container-fluid d-flex flex-column align-items-center p-2 h-100"
                 style={{backgroundColor: "white"}}>
        <h3>Channels</h3>
        <ChannelList/>
    </div>)
}