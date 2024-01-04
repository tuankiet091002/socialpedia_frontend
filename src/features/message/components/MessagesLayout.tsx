import {Outlet} from "react-router-dom";
import {ContentLayout} from "@components/layout/ContentLayout.tsx";
import {ReactNode} from "react";

type MessagesLayoutProps = {
    title: string;
    column: ReactNode
};

export const MessagesLayout = ({title, column}: MessagesLayoutProps) => {
    return (
        <ContentLayout title={title} navbar={column}>
            <Outlet/>
        </ContentLayout>
    )
}