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
      className={`input ${className}`}
      onChange={(e) => handleChange(e, name)}
      value={value ?? ""}
      {...rest}
    />
  );
}
