import {SuspenseLayout} from "@components/Layout/SuspenseLayout.tsx";
import {Outlet} from "react-router-dom";

import {Header} from "@components/Layout/MainLayout/Header.tsx";
import {Sidebar} from "@components/Layout/MainLayout/Sidebar.tsx";


export const MainLayout = () => {

    return (
        <SuspenseLayout>
            <Header/>
            <div className="position-relative" style={{
                backgroundColor: 'blue',
                height: 'calc(100vh - 56px)'
            }}>
                <Sidebar/>
                <Outlet/>
            </div>
        </SuspenseLayout>
    )
}