import React, {Suspense} from "react";
import {Spinner} from "@components/Elements/Spinner.tsx";

type SuspenseLayoutProps = {
    children: React.ReactNode
}

export const SuspenseLayout = ({children}: SuspenseLayoutProps) => {
    return (
        <Suspense
            fallback={<div className="h-100 w-100 d-flex justify-content-center align-items-center">
                <Spinner/>
            </div>
            }
        >
            {children}
        </Suspense>
    );
};