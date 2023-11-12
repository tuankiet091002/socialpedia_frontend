import React, {Suspense} from "react";
import {Spinner} from "@components/Elements";

type SuspenseLayoutProps = {
    children: React.ReactNode
}

export const SuspenseLayout = ({children}: SuspenseLayoutProps) => {
    return (
        <Suspense
            fallback={<Spinner size="xl"/>}
        >
            {children}
        </Suspense>
    );
};