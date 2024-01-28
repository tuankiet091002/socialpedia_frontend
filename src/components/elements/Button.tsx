import clsx from "clsx";
import {ButtonHTMLAttributes, forwardRef} from "react";
import {Spinner} from "@components/elements/Spinner.tsx";

const variants = {
    primary: "bg-blue-600 text-white hover:opacity-80",
    inverse: "bg-white text-blue-600 hover:bg-blue-600 hover:text-white",
    danger: "bg-red-600 text-white hover:opacity-80",
    inverse_danger: "bg-white text-red-600 hover:bg-red-500 hover:text-white"
};

const sizes = {
    sm: "py-1 px-2 text-sm",
    md: "py-2 px-4 text-md",
    lg: "py-3 px-6 text-lg"
};


export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: keyof typeof variants;
    size?: keyof typeof sizes;
    isLoading?: boolean;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            type = "button",
            className = "",
            variant = "primary",
            size = "md",
            isLoading = false,
            ...props
        },
        ref
    ) => {
        return (
            <button
                ref={ref}
                type={type}
                className={clsx(
                    "flex justify-center items-center border border-gray-300 disabled:opacity-70 disabled:cursor-not-allowed rounded-md shadow-sm font-medium focus:outline-none",
                    variants[variant],
                    sizes[size],
                    className
                )}
                {...props}
            >
                {isLoading && <Spinner size="sm" className="text-current"/>}
                <span className="mx-2">{props.children}</span>
            </button>
        );
    }
);

Button.displayName = "Button";