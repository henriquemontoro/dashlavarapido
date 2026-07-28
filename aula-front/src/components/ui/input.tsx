import { forwardRef, type InputHTMLAttributes } from "react"
import { cn } from "@/lib/utils"

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "h-10 w-full rounded-md border border-brand-line bg-brand-card px-3 text-sm text-brand-ink placeholder:text-brand-ink/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan",
        className,
      )}
      {...props}
    />
  ),
)
Input.displayName = "Input"
