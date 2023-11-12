import React from "react";

type LayoutProps = {
    children: React.ReactNode;
    title: string;
};

export const AuthLayout = ({children, title}: LayoutProps) => {

    return (
        <div className="container-fluid vh-100" style={{backgroundColor: 'red'}}>
            <div className="row d-flex justify-content-center align-items-center h-100">
                {/*<div className="col-4">*/}
                {/*    <img className="img-fluid" src={logo} alt="logo"/>*/}
                {/*</div>*/}
                <div className="col-12 col-md-4">
                    <div className="card">
                        <div className="card-body p-5 text-center">
                            <h3 className="mb-2">{title}</h3>
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

