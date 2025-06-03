interface InputProps extends React.ComponentPropsWithoutRef<"input"> {
  value: string;
  name: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>, name: string) => void;
  className?: string;
}

export default function Input({
  value,
  name,
  handleChange,
  className,
  ...rest
}: InputProps) {
  return (
    <input
      name={name}
      className={`input [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus:outline-2 !outline-primary transition-all duration-75 ${className}`}
      onChange={(e) => handleChange(e, name)}
      value={value ?? ""}
      {...rest}
    />
  );
}
