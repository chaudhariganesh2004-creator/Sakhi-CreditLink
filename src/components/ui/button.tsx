import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "tertiary" | "destructive";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    "bg-[#0F5E4E] text-white border border-[#0F5E4E] hover:bg-[#0A4539] hover:border-[#0A4539]",
  secondary:
    "bg-white text-[#141A23] border border-[#C9C3B4] hover:bg-[#F2EFE8]",
  tertiary:
    "bg-transparent text-[#0F5E4E] border border-transparent hover:bg-[#ECFDF5]",
  destructive:
    "bg-[#B91C1C] text-white border border-[#B91C1C] hover:bg-[#991B1B] hover:border-[#991B1B]",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "min-h-[44px] md:min-h-[34px] px-3 text-[12.5px]",
  md: "min-h-[44px] md:min-h-[38px] px-4 text-[13px]",
  lg: "min-h-[44px] md:min-h-[42px] px-5 text-[14px]",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "secondary",
      size = "md",
      loading = false,
      disabled,
      className,
      children,
      type = "button",
      ...props
    },
    ref
  ) => {
    const isDisabled = Boolean(disabled || loading);
    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F5E4E] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          VARIANT_CLASSES[variant],
          SIZE_CLASSES[size],
          className
        )}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin shrink-0" aria-hidden="true" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
