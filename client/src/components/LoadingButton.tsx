import { Loader2 } from "lucide-react";
import Button from "./ui/Button";

interface LoadingButton extends React.ComponentPropsWithoutRef<"button"> {
  children: React.ReactNode;
  loading: boolean;
  className?: string;
  disabled?: boolean;
  loadingText?: string;
}

export default function LoadingButton({
  children,
  loading,
  className,
  disabled,
  loadingText,
  ...rest
}: LoadingButton) {
  return (
    <Button className={className} {...rest} disabled={disabled || loading}>
      {loading ? (
        <>
          <Loader2 className={`animate-spin ${loadingText ? "mr-1" : ""}`} />
          {loadingText}
        </>
      ) : (
        children
      )}
    </Button>
  );
}
