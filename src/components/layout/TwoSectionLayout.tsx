import {ReactNode} from "react";
import {Outlet} from "react-router-dom";

type TwoSectionLayoutProps = {
    navbar: ReactNode
};

export const TwoSectionLayout = ({navbar}: TwoSectionLayoutProps) => {
    return (
        <>
            <div className="grid h-full grid-cols-[300px_auto]">
                {navbar}
                <Outlet/>
            </div>
        </>
    );
};