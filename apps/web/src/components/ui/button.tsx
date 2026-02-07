import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 active:scale-95",
    {
        variants: {
            variant: {
                default:
                    "bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg hover:shadow-glow-primary hover:from-primary-400 hover:to-secondary-400",
                primary:
                    "bg-white text-black hover:bg-zinc-200 shadow-lg shadow-purple-500/20",
                secondary:
                    "glass border border-white/20 text-white hover:bg-white/10 hover:border-primary-500/50",
                outline:
                    "border border-white/20 bg-transparent text-white hover:bg-white/5 hover:border-white/40",
                ghost:
                    "bg-transparent text-white hover:bg-white/10",
                link:
                    "text-primary-400 underline-offset-4 hover:underline",
            },
            size: {
                default: "h-11 px-6 py-3",
                sm: "h-9 px-4 py-2 text-xs",
                lg: "h-14 px-8 py-4 text-base",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button";
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";

export { Button, buttonVariants };
