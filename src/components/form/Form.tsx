import {zodResolver} from '@hookform/resolvers/zod';
import {SubmitHandler, useForm, UseFormProps, UseFormReturn} from 'react-hook-form';
import {ZodType, ZodTypeDef} from 'zod';
import clsx from "clsx";
import {ReactNode} from "react";

type FormProps<TFormValues extends Record<string, unknown>, Schema> = {
    className?: string;
    onSubmit: SubmitHandler<TFormValues>;
    children: (methods: UseFormReturn<TFormValues>) => ReactNode;
    options?: UseFormProps<TFormValues>;
    id?: string;
    schema?: Schema;
    enctype?: string;
};

export const Form = <
    TFormValues extends Record<string, unknown> = Record<string, unknown>,
    Schema extends ZodType<unknown, ZodTypeDef, unknown> = ZodType<unknown, ZodTypeDef, unknown>
>({
      onSubmit,
      children,
      className,
      options,
      id,
      schema,
      enctype
  }: FormProps<TFormValues, Schema>) => {
    const methods = useForm<TFormValues>({...options, resolver: schema && zodResolver(schema)});
    return (
        <form
            className={clsx("space-y-2 mb-2", className)}
            onSubmit={methods.handleSubmit(onSubmit)}
            id={id}
            encType={enctype}
        >
            {children(methods)}
        </form>
    );
};