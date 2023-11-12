import {Head} from '@components/Elements/Head'
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
            <div className="container-fluid row g-0 position-absolute w-100 h-100" style={{paddingLeft: '4.5rem'}}>
                <div className="col-3" style={{backgroundColor: 'red'}}>
                    {navbar}
                </div>
                <div className="col-9" style={{backgroundColor: 'green'}}>{children}</div>
            </div>

        </>
    );
};