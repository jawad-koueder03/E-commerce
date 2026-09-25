// src/components/common/Button.jsx
import React from 'react';
import './Button.css';

/**
 * مكون زر قابل لإعادة الاستخدام
 * @param {string} variant - نوع الزر: 'primary', 'secondary', 'outline', 'danger', 'success'
 * @param {string} size - حجم الزر: 'small', 'medium', 'large'
 * @param {boolean} fullWidth - هل يأخذ العرض الكامل؟
 * @param {boolean} disabled - هل الزر معطل؟
 * @param {function} onClick - دالة النقر
 * @param {string} type - نوع الزر: 'button', 'submit', 'reset'
 * @param {ReactNode} children - محتوى الزر
 * @param {string} className - كلاسات إضافية
 */
const Button = ({
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  disabled = false,
  onClick,
  type = 'button',
  children,
  className = '',
  ...rest
}) => {
  // تجميع الكلاسات
  const buttonClasses = [
    'btn',
    `btn-${variant}`,
    `btn-${size}`,
    fullWidth ? 'btn-full-width' : '',
    disabled ? 'btn-disabled' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;