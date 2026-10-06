import React from 'react';

/**
 * Reusable UI Button Component for AgileFlow
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Button label or content
 * @param {'primary' | 'secondary' | 'danger' | 'outline' | 'ghost' | 'success'} [props.variant='primary'] - Button style variant
 * @param {'sm' | 'md' | 'lg'} [props.size='md'] - Button size
 * @param {boolean} [props.isLoading=false] - Shows loading spinner & disables button
 * @param {string} [props.loadingText] - Text to show during loading state
 * @param {React.ReactNode} [props.icon] - Icon node to display
 * @param {'left' | 'right'} [props.iconPosition='left'] - Icon placement relative to label
 * @param {boolean} [props.fullWidth=false] - Makes button expand full container width
 * @param {boolean} [props.disabled=false] - Disabled state
 * @param {'button' | 'submit' | 'reset'} [props.type='button'] - HTML button type
 * @param {string} [props.className=''] - Additional custom CSS classes
 */
export default function Button({
    children,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    loadingText,
    icon,
    iconPosition = 'left',
    fullWidth = false,
    disabled = false,
    type = 'button',
    className = '',
    ...props
}) {
    const baseStyles =
        'inline-flex items-center justify-center font-semibold transition-all duration-150 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none select-none active:scale-[0.98]';

    const variants = {
        primary:
            'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 focus:ring-blue-500 shadow-sm shadow-blue-500/20 hover:shadow-md hover:shadow-blue-500/30',
        secondary:
            'bg-slate-900 text-white hover:bg-slate-800 active:bg-slate-950 focus:ring-slate-700 shadow-sm shadow-slate-900/10',
        danger:
            'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus:ring-red-500 shadow-sm shadow-red-500/20',
        outline:
            'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 active:bg-slate-100 focus:ring-slate-300 shadow-2xs',
        ghost:
            'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 active:bg-slate-200 focus:ring-slate-300',
        success:
            'bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800 focus:ring-emerald-500 shadow-sm shadow-emerald-500/20',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-xs gap-1.5',
        md: 'px-4 py-2.5 text-sm gap-2',
        lg: 'px-5 py-3 text-base gap-2.5',
    };

    const widthStyle = fullWidth ? 'w-full' : '';

    return (
        <button
            type={type}
            disabled={disabled || isLoading}
            className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${widthStyle} ${className}`}
            {...props}
        >
            {isLoading ? (
                <>
                    <svg
                        className="animate-spin -ml-0.5 h-4 w-4 shrink-0 text-current"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </svg>
                    <span>{loadingText || children}</span>
                </>
            ) : (
                <>
                    {icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
                    {children && <span>{children}</span>}
                    {icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
                </>
            )}
        </button>
    );
}
