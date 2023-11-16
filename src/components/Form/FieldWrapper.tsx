import * as React from 'react';
import {FieldError} from 'react-hook-form';

type FieldWrapperProps = {
    id: string;
    label?: string;
    className?: string;
    children: React.ReactNode;
    error?: FieldError | undefined;
    description?: string;
};

export type FieldWrapperPassThroughProps = Omit<FieldWrapperProps, 'className' | 'children'>;

export const FieldWrapper = (props: FieldWrapperProps) => {
    const {label, id, className, error, children} = props;
    return (
        <div className="form-floating my-3">
            {children}
            <label className={className} htmlFor={id}>
                {label}
            </label>
            {error?.message && (
                <p className="text-left">
                    <small className="form-text text-danger ">
                        {error.message}
                    </small>
                </p>
            )}
        </div>
    );
};