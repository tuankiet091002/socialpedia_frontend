import React from "react";
import {Outlet} from "react-router-dom";
import {SuspenseLayout} from "@components/Layout/SuspenseLayout.tsx";

export const AuthLayout = () => {

    return (<SuspenseLayout>
            <div className="container-fluid vh-100" style={{backgroundColor: 'red'}}>
                <div className="row d-flex justify-content-center align-items-center h-100">
                    {/*<div className="col-4">*/}
                    {/*    <img className="img-fluid" src={logo} alt="logo"/>*/}
                    {/*</div>*/}
                    <div className="col-12 col-md-4">
                        <div className="card">
                            <div className="card-body p-5 text-center">
                                <Outlet/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </SuspenseLayout>
    );
};

