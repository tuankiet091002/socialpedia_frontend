import {Head} from '@components/elements/Head.tsx'
import {ReactNode} from "react";

type ContentLayoutProps = {
    title: string;
    children: ReactNode
    navbar: ReactNode
};

export const ContentLayout = ({title, children, navbar}: ContentLayoutProps) => {
    return (
        <>
            <Head title={title}/>
            <div className="row g-0">
                <div className="col-3" style={{backgroundColor: 'red'}}>
                    {navbar}
                </div>
                <div className="col-9" style={{backgroundColor: 'green'}}>{children}</div>
            </div>

        </>
    );
};