import {Outlet} from "react-router-dom";
import {TwoSectionLayout} from "@components/layout/TwoSectionLayout.tsx";
import {ReactNode} from "react";

type MessagesLayoutProps = {
    title: string;
    column: ReactNode
};

export const MessagesLayout = ({title, column}: MessagesLayoutProps) => {
    return (
        <TwoSectionLayout title={title} navbar={column}>
            <Outlet/>
        </TwoSectionLayout>
    )
}