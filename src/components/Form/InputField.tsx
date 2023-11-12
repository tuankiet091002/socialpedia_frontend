import clsx from 'clsx';
import {UseFormRegisterReturn} from 'react-hook-form';

import {FieldWrapper, FieldWrapperPassThroughProps} from './FieldWrapper';

type InputFieldProps = FieldWrapperPassThroughProps & {
    type?: 'text' | 'email' | 'password';
    className?: string;
    registration: Partial<UseFormRegisterReturn>;
};

export const InputField = (props: InputFieldProps) => {
    const {type = 'text', id, label, className, registration, error} = props;
    return (
        <FieldWrapper label={label} error={error} id={id}>
            <input
                id={id}
                type={type}
                className={clsx(
                    'form-control',
                    className
                )}
                placeholder={label}
                {...registration}
            />
        </FieldWrapper>
    );
};