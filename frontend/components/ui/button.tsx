import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// Button variants with consistent orange and dark purple theme
const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90", // Orange Button with lighter hover effect
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90", // Red destructive button
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground", // Outline style with accent hover
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80", // Secondary (muted) button
        ghost: "hover:bg-accent hover:text-accent-foreground", // Ghost button for minimal background
        link: "text-primary underline-offset-4 hover:underline", // Link style button
      },
      size: {
        default: "h-10 px-4 py-2", // Standard size
        sm: "h-9 rounded-md px-3", // Small size
        lg: "h-11 rounded-md px-8", // Large size
        icon: "h-10 w-10", // Icon size
      },
    },
    defaultVariants: {
      variant: "default", // Default to the orange style
      size: "default", // Default size
    },
  }
);

// Button interface to extend HTML Button attributes
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

// Button component
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"; // Optionally render as another element
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))} // Apply dynamic styles
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
