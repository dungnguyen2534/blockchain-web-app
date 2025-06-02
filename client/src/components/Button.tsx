import React from "react";

interface ButtonProps extends React.ComponentPropsWithoutRef<"button"> {
  children: React.ReactNode;
  className?: string;
}

export default function Button({ children, className, ...rest }: ButtonProps) {
  return (
    <button className={`btn ${className}`} {...rest}>
      {children}
    </button>
  );
}
