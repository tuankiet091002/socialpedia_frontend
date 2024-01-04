import clsx from 'clsx';
import * as React from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

import { FieldWrapper, FieldWrapperPassThroughProps } from './FieldWrapper';

type Option = {
    label: React.ReactNode;
    value: string | number | string[];
};

type SelectFieldProps = FieldWrapperPassThroughProps & {
    options: Option[];
    className?: string;
    defaultValue?: string;
    placeholder?: string;
    registration: Partial<UseFormRegisterReturn>;
};

export const SelectField = (props: SelectFieldProps) => {
    const { id, label, options, error, className, defaultValue, registration, placeholder } = props;
    return (
        <FieldWrapper label={label} error={error} id={id}>
            <select
                placeholder={placeholder}
                name="location"
                className={clsx(
                    'form-control',
                    className
                )}
                defaultValue={defaultValue}
                {...registration}
            >
                {options.map(({ label, value }) => (
                    <option key={label?.toString()} value={value}>
                        {label}
                    </option>
                ))}
            </select>
        </FieldWrapper>
    );
};