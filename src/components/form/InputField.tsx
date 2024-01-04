import clsx from 'clsx';
import {UseFormRegisterReturn} from 'react-hook-form';

import {FieldWrapper, FieldWrapperPassThroughProps} from './FieldWrapper';

type InputFieldProps = FieldWrapperPassThroughProps & {
    type?: 'text' | 'email' | 'password' | 'date';
    className?: string;
    registration: Partial<UseFormRegisterReturn>;
};

export const InputField = (props: InputFieldProps) => {
    const {type = 'text', label, className, registration, error} = props;
    return (
        <FieldWrapper label={label} error={error}>
            <input
                type={type}
                className={clsx(
                    'appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none placeholder-gray-400 focus:border-blue-500',
                    error && 'border-red-500',
                    className
                )}
                {...registration}
            />
        </FieldWrapper>
    );
};