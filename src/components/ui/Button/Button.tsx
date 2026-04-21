'use client';

import { ButtonHTMLAttributes, FC, ReactNode, memo } from 'react';
import classnames from 'classnames';
import styles from './Button.module.scss';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  isFullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const ButtonComponent: FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  isFullWidth = false,
  leftIcon,
  rightIcon,
  disabled,
  className,
  type = 'button',
  ...rest
}) => {
  const isDisabled = disabled || isLoading;

  const rootClassName = classnames(
    styles.button,
    styles[`button--${variant}`],
    styles[`button--${size}`],
    isLoading && styles['button--loading'],
    isFullWidth && styles['button--full-width'],
    isDisabled && styles['button--disabled'],
    className,
  );

  return (
    <button
      className={rootClassName}
      disabled={isDisabled}
      type={type}
      aria-busy={isLoading}
      aria-disabled={isDisabled}
      {...rest}
    >
      {isLoading && (
        <span className={styles.button__spinner} aria-hidden="true" />
      )}

      {!isLoading && leftIcon && (
        <span className={styles.button__icon} aria-hidden="true">
          {leftIcon}
        </span>
      )}

      <span className={styles.button__label}>{children}</span>

      {!isLoading && rightIcon && (
        <span
          className={classnames(
            styles.button__icon,
            styles['button__icon--right'],
          )}
          aria-hidden="true"
        >
          {rightIcon}
        </span>
      )}
    </button>
  );
};

export const Button = memo(ButtonComponent);
