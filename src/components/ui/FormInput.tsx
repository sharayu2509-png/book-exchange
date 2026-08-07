import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';

type BaseProps = {
  label: string;
  error?: string;
  required?: boolean;
  helperText?: string;
  wrapperClassName?: string;
};

type FormInputProps = BaseProps &
  InputHTMLAttributes<HTMLInputElement> & {
    as?: 'input';
  };

type FormTextareaProps = BaseProps &
  TextareaHTMLAttributes<HTMLTextAreaElement> & {
    as: 'textarea';
  };

export type FormFieldProps = FormInputProps | FormTextareaProps;

const fieldClassName =
  'w-full rounded-2xl border border-border bg-bg px-4 py-3 text-sm text-text outline-none transition placeholder:text-subtext/60 focus:border-primary focus:ring-2 focus:ring-primary/10';

export const FormField = (props: FormFieldProps) => {
  const { label, error, required, helperText, wrapperClassName, as, className, ...rest } = props as FormFieldProps & {
    className?: string;
    as?: 'input' | 'textarea';
  };
  const ariaLabel = ((rest as { ['aria-label']?: string })['aria-label'] as string | undefined) ?? label;
  const star = required ? <span className="ml-1 text-error">*</span> : null;
  const labelContent = (
    <span className="mb-2 block text-sm font-medium text-subtext">
      {label}
      {star}
    </span>
  );

  return (
    <label className={`block ${wrapperClassName ?? ''}`}>
      {labelContent}
      {as === 'textarea' ? (
        (() => {
          const textareaProps = rest as TextareaHTMLAttributes<HTMLTextAreaElement>;
          return (
            <textarea
              {...textareaProps}
              className={`${fieldClassName} ${className ?? ''}`}
              aria-invalid={Boolean(error)}
              aria-label={ariaLabel}
            />
          );
        })()
      ) : (
        (() => {
          const inputProps = rest as InputHTMLAttributes<HTMLInputElement>;
          return (
            <input
              {...inputProps}
              className={`${fieldClassName} ${className ?? ''}`}
              aria-invalid={Boolean(error)}
              aria-label={ariaLabel}
            />
          );
        })()
      )}
      {helperText && !error ? <p className="mt-2 text-xs text-subtext">{helperText}</p> : null}
      {error ? <p className="mt-2 text-sm text-error">{error}</p> : null}
    </label>
  );
};

type FormSelectProps = BaseProps & SelectHTMLAttributes<HTMLSelectElement> & { children: ReactNode };

export const FormSelect = ({ label, error, required, children, wrapperClassName, className, ...props }: FormSelectProps) => {
  return (
    <label className={`block ${wrapperClassName ?? ''}`}>
      <span className="mb-2 block text-sm font-medium text-subtext">
        {label}
        {required ? <span className="ml-1 text-error">*</span> : null}
      </span>
      <select
        {...props}
        className={`w-full rounded-2xl border border-border bg-bg px-4 py-3 text-sm text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 ${className ?? ''}`}
        aria-label={((props as { ['aria-label']?: string })['aria-label'] as string | undefined) ?? label}
        aria-invalid={Boolean(error)}
      >
        {children}
      </select>
      {error ? <p className="mt-2 text-sm text-error">{error}</p> : null}
    </label>
  );
};
