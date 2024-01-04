import {Head} from '@components/elements/Head.tsx'
import {ReactNode} from "react";

type ContentLayoutProps = {
    title: string;
    children: ReactNode
    navbar: ReactNode
};

export const TwoSectionLayout = ({title, children, navbar}: ContentLayoutProps) => {
    return (
        <>
            <Head title={title}/>
            <div className="grid h-full grid-cols-[250px_auto]">
                {navbar}
                {children}
            </div>
        </>
    );
};