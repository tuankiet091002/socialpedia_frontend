import {SuspenseLayout} from "@components/layout/SuspenseLayout.tsx";
import {Outlet} from "react-router-dom";

import {Header} from "@components/layout/MainLayout/Header.tsx";
import {Sidebar} from "@components/layout/MainLayout/Sidebar.tsx";


export const MainLayout = () => {

    return (
        <>
            <Header/>
            <div className="position-relative" style={{
                backgroundColor: 'blue',
                height: 'calc(100vh - 56px)'
            }}>
                <Sidebar/>
                <div className="w-100 h-100" style={{paddingLeft: '72px'}}>
                    <SuspenseLayout>
                        <Outlet/>
                    </SuspenseLayout>
                </div>

            </div>
        </>
    )
}