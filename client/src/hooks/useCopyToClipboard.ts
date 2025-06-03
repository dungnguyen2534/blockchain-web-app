import { useEffect, useState } from "react";

export default function useCopyToclipboard() {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => {
        setCopied(false);
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [copied]);

  const copyToClipboard = (text: string) => {
    if (copied) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
  };

  return { copied, copyToClipboard };
}
