import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
    "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors",
    {
        variants: {
            variant: {
                default:
                    "bg-primary-500/20 text-primary-300 border border-primary-500/30",
                secondary:
                    "bg-secondary-500/20 text-secondary-300 border border-secondary-500/30",
                accent:
                    "bg-accent-500/20 text-accent-300 border border-accent-500/30",
                success:
                    "bg-green-500/20 text-green-400 border border-green-500/30",
                warning:
                    "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
                destructive:
                    "bg-red-500/20 text-red-400 border border-red-500/30",
                outline:
                    "bg-transparent text-white border border-white/20",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
);

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
    return (
        <div className={cn(badgeVariants({ variant }), className)} {...props} />
    );
}

export { Badge, badgeVariants };
