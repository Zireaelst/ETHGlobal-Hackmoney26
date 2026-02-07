import { cn } from "@/lib/utils";

interface BentoGridProps {
    className?: string;
    children?: React.ReactNode;
}

export function BentoGrid({ className, children }: BentoGridProps) {
    return (
        <div
            className={cn(
                "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
                className
            )}
        >
            {children}
        </div>
    );
}

interface BentoGridItemProps {
    className?: string;
    title?: string | React.ReactNode;
    description?: string | React.ReactNode;
    header?: React.ReactNode;
    icon?: React.ReactNode;
    children?: React.ReactNode;
}

export function BentoGridItem({
    className,
    title,
    description,
    header,
    icon,
    children,
}: BentoGridItemProps) {
    return (
        <div
            className={cn(
                "group/bento row-span-1 rounded-2xl p-6",
                "bg-gradient-to-br from-white/[0.05] to-transparent",
                "border border-white/10 hover:border-primary-500/30",
                "transition-all duration-300",
                "hover:shadow-glow-sm hover:bg-white/[0.08]",
                className
            )}
        >
            {header && (
                <div className="mb-4">
                    {header}
                </div>
            )}

            <div className="flex flex-col gap-2">
                {icon && (
                    <div className="mb-2 opacity-50">
                        {icon}
                    </div>
                )}

                {title && (
                    <div className="text-lg font-semibold text-white group-hover/bento:text-primary-300 transition-colors">
                        {title}
                    </div>
                )}

                {description && (
                    <div className="text-sm text-zinc-400">
                        {description}
                    </div>
                )}

                {children}
            </div>
        </div>
    );
}
