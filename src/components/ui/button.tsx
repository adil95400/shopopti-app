import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  asChild?: boolean;
  children: React.ReactNode;
}

export function Button({ 
  variant = 'default', 
  size = 'default', 
  asChild = false,
  className = '', 
  children, 
  ...props 
}: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  
  const variantStyles = {
    default: "bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500",
    outline: "border border-gray-300 bg-transparent hover:bg-gray-100 focus-visible:ring-gray-400",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 focus-visible:ring-gray-400",
    ghost: "hover:bg-gray-100 hover:text-gray-900 focus-visible:ring-gray-400",
    link: "text-blue-600 underline-offset-4 hover:underline focus-visible:ring-blue-500"
  };
  
  const sizeStyles = {
    default: "h-10 px-4 py-2",
    sm: "h-9 px-3 text-sm",
    lg: "h-11 px-8",
    icon: "h-10 w-10"
  };

  const Comp = asChild ? React.Children.only(children).type : 'button';
  const childProps = asChild ? React.Children.only(children).props : {};

  return (
    <Comp
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
      {...childProps}
    >
      {asChild ? React.Children.only(children).props.children : children}
    </Comp>
  );
}