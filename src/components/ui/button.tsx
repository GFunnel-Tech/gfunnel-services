import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold ring-offset-background transition-all duration-300 ease-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 rounded-button",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-button",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-button",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-button",
        ghost: "hover:bg-accent/10 hover:text-accent-foreground rounded-lg",
        link: "text-primary underline-offset-4 hover:underline",
        gradient: "btn-gradient text-white font-bold rounded-button hover:-translate-y-1",
        "gradient-secondary": "bg-card text-foreground font-bold rounded-button hover:bg-muted shadow-card hover:shadow-card-hover hover:-translate-y-1",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 rounded-button px-4",
        lg: "h-12 rounded-button px-10 text-base",
        xl: "h-14 rounded-button px-12 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };