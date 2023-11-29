import {Outlet} from "react-router-dom";
import {Head} from "@components/Elements";

type UsersLayoutProps = {
    title: string;
};

export const UsersLayout = ({title}: UsersLayoutProps) => {
    return (<>
        <Head title={title}/>
        <div className="container-fluid w-100 h-100" style={{paddingLeft: '4.5rem'}}>
            <Outlet/>
        </div>
    </>)
}