import React, {Suspense} from "react";
import {Spinner} from "@components/elements/Spinner.tsx";

type SuspenseLayoutProps = {
    children: React.ReactNode
}

export const SuspenseLayout = ({children}: SuspenseLayoutProps) => {
    
    return (
        <Suspense
            fallback={<div className="flex h-full w-full items-center justify-center">
                <Spinner size="xl"/>
            </div>
            }
        >
            {children}
        </Suspense>
    );
};