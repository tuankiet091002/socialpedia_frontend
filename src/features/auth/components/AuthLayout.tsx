import {Outlet} from "react-router-dom";
import {SuspenseLayout} from "@components/layout/SuspenseLayout.tsx";
import img from "src/assets/small-team-discussing-ideas-2194220-0.svg"

export const AuthLayout = () => {

    return (
        <div className="flex min-h-screen items-center justify-center bg-white">
            <div className="h-5/6 w-10/12 rounded-md">
                <div className="grid h-full grid-cols-12">
                    <div
                        className="col-span-12 h-full w-full rounded-2xl border border-gray-300 p-8 shadow-lg lg:col-span-5">
                        <SuspenseLayout>
                            <Outlet/>
                        </SuspenseLayout>
                    </div>
                    <img className="col-span-7 hidden h-full w-full object-fill lg:block" src={img}
                         alt="Demonstration Image"/>
                </div>

            </div>
        </div>
    )
};

