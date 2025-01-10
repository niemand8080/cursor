"use client"
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  "px-2 py-1 w-auto inline-flex items-center justify-center rounded-md bg-primary text-foreground hover:bg-primary/80 transition-all disabled:bg-foreground/10 disabled:text-foreground/40",
  {
    variants: {
      variant: {
        default:
          "text-primary-foreground",
        destructive:
          "cursor-destructive text-destructive-foreground bg-destructive hover:bg-destructive/80 disabled:bg-destructive/10 disabled:text-destructive/80 dark:disabled:text-destructive",
        outline:
          "bg-background hover:bg-foreground/20 border disabled:bg-background disabled:hover:bg-background",
        secondary:
          "bg-secondary hover:bg-secondary text-secondary-foreground",
        ghost: 
          "bg-transparent hover:bg-foreground/20 disabled:bg-foreground/0",
        link: 
          "bg-transparent hover:bg-transparent hover:underline text-primary hover:text-primary/80 underline-offset-2 disabled:bg-transparent disabled:hover:no-underline",
      },
      size: {
        auto: "",
        default: "h-9",
        sm: "h-7 text-sm px-1 rounded-sm",
        lg: "h-10 text-lg",
        icon: "h-9 w-9",
      },
      activeLink: {
        true: "text-primary",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      activeLink: false,
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

// eslint-disable-next-line react/display-name
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, activeLink, asChild = false, ...props }, ref) => {
    const Element = asChild ? Slot : "button";
    return (
      <Element
        ref={ref}
        className={cn(buttonVariants({ variant, size, activeLink, className }))}
        {...props}
      />
    )
  }
)