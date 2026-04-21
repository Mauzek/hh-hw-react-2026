'use client';

import { InputHTMLAttributes, useId } from 'react';
import classnames from 'classnames';
import styles from './Input.module.scss';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = ({
  label,
  error,
  hint,
  className,
  id,
  ...rest
}: InputProps) => {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  const inputClassName = classnames(
    styles.input__field,
    error && styles['input__field--error'],
    className,
  );

  return (
    <div className={styles.input}>
      {label && (
        <label className={styles.input__label} htmlFor={inputId}>
          {label}
        </label>
      )}

      <input
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

      {hint && !error && (
        <span id={`${inputId}-hint`} className={styles.input__hint}>
          {hint}
        </span>
      )}
    </div>
  );
};
