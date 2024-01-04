import {SuspenseLayout} from "@components/layout/SuspenseLayout.tsx";

import {Header} from "@components/layout/MainLayout/Header.tsx";
import {Sidebar} from "@components/layout/MainLayout/Sidebar.tsx";
import {Outlet} from "react-router-dom";


export const MainLayout = () => {

    return (
        <div className="w-100 h-screen">
            <Header/>
            <Sidebar/>
            <div className="w-100 h-[calc(100vh-68px)] lg:pl-[60px]">
                <SuspenseLayout>
                    <Outlet/>
                </SuspenseLayout>
            </div>
        </div>
    )
}