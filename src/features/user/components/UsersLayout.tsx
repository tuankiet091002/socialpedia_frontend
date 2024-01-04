import {Outlet} from "react-router-dom";
import {Head} from "@components/elements/Head.tsx";

type UsersLayoutProps = {
    title: string;
};

export const UsersLayout = ({title}: UsersLayoutProps) => {
    return (<>
        <Head title={title}/>
        <Outlet/>
    </>)
}