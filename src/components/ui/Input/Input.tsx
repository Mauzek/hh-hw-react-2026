'use client';

import { InputHTMLAttributes, forwardRef, useId } from 'react';
import styles from './Input.module.scss';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className, id, ...rest }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    const inputClassName = [
      styles.input__field,
      error ? styles['input__field--error'] : '',
      className ?? '',
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={styles.input}>
        {label && (
          <label className={styles.input__label} htmlFor={inputId}>
            {label}
          </label>
        )}

        <input
          ref={ref}
          id={inputId}
          className={inputClassName}
          aria-invalid={Boolean(error)}
          aria-describedby={
            error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
          }
          {...rest}
        />

        {error && (
          <span
            id={`${inputId}-error`}
            className={styles.input__error}
            role="alert"
          >
            {error}
          </span>
        )}

        {!error && hint && (
          <span id={`${inputId}-hint`} className={styles.input__hint}>
            {hint}
          </span>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';
