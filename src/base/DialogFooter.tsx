import { cn } from "@app/utils";
import React from "react";

type DialogFooterProps = {
    children: React.ReactNode;
    className?: string;
};

export default function DialogFooter({
    children,
    className,
}: DialogFooterProps) {
    return (
        <div className={cn("flex", "justify-end", "pt-4 pb-1", className)}>
            {children}
        </div>
    );
}
