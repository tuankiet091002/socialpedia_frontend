import {cloneElement, forwardRef, InputHTMLAttributes, ReactElement} from "react";
import clsx from "clsx";

const sizes: { [char: string]: string } = {
    sm: "py-1 px-2 text-sm",
    md: "py-2 px-4 text-md",
    lg: "py-3 px-6 text-lg"
};

export type IndependentInputProps = InputHTMLAttributes<HTMLInputElement> & {
    textSize?: keyof typeof sizes;
    isLoading?: boolean;
    endIcon?: ReactElement
};

export const IndependentInput = forwardRef<HTMLInputElement, IndependentInputProps>((
        {
            type = "text",
            className = "",
            textSize = "md",
            endIcon,
            ...props
        }, ref) => {

        const icon = endIcon ? cloneElement(endIcon, {
            className: "text-gray-500 text-2xl ml-[-30px]"
        }) : null;

        return (
            <div className="flex w-full flex-row items-center">
                <input
                    type={type}
                    ref={ref}
                    className={clsx("inline appearance-none text-sm rounded-md border border-gray-300 pl-2 pr-[30px] py-1 placeholder-gray-400 shadow-md focus:outline-none  disabled:border-0 disabled:bg-gray-100 disabled:shadow-none",
                        sizes[textSize],
                        className
                    )}
                    {...props}
                />
                {icon}
            </div>)
    }
)
