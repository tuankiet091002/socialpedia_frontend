import {ContentLayout} from "@components/Layout";
import {ChannelColumn} from "@features/channels/components";
import {Outlet} from "react-router-dom";

type MessagesLayoutProps = {
    title: string;
};

export const MessagesLayout = ({title}: MessagesLayoutProps) => {
    return (
        <ContentLayout title={title} navbar={<ChannelColumn/>}>
            <Outlet/>
        </ContentLayout>

    )
}