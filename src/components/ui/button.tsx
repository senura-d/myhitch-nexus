"use client";

import { cva, type VariantProps } from "class-variance-authority";
import Link from "next/link";
import * as React from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded font-medium transition-[background-color,border-color,color,transform,opacity] duration-150 disabled:pointer-events-none disabled:opacity-45 active:translate-y-px [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-accent text-accent-fg hover:bg-accent-hover active:bg-accent-press font-semibold",
        secondary:
          "bg-surface-3 text-fg hover:bg-surface-3/70 border border-border-strong",
        outline:
          "border border-border-strong text-fg hover:bg-surface-2 hover:border-fg-subtle",
        ghost: "text-fg-muted hover:bg-surface-2 hover:text-fg",
        danger: "bg-danger text-white hover:bg-danger/85 font-semibold",
        live: "bg-live text-white hover:bg-live/85 font-semibold",
        link: "text-accent underline-offset-4 hover:underline p-0 h-auto",
        // Sits over video/poster artwork — needs its own contrast floor.
        overlay:
          "bg-black/55 text-white backdrop-blur-sm hover:bg-black/75 border border-white/15",
      },
      size: {
        xs: "h-7 px-2.5 text-xs [&_svg]:size-3.5",
        sm: "h-8 px-3 text-sm [&_svg]:size-4",
        md: "h-10 px-4 text-sm [&_svg]:size-[18px]",
        lg: "h-12 px-6 text-base [&_svg]:size-5",
        icon: "size-9 [&_svg]:size-[18px]",
        "icon-sm": "size-7 [&_svg]:size-4",
        "icon-lg": "size-11 [&_svg]:size-5",
      },
      block: { true: "w-full", false: "" },
    },
    defaultVariants: { variant: "secondary", size: "md", block: false },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  href?: string;
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    { className, variant, size, block, href, loading, children, disabled, ...props },
    ref,
  ) {
    const classes = cn(buttonVariants({ variant, size, block }), className);
    const content = (
      <>
        {loading ? (
          <span
            aria-hidden
            className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
          />
        ) : null}
        {children}
      </>
    );

    if (href && !disabled) {
      return (
        <Link href={href} className={classes}>
          {content}
        </Link>
      );
    }

    return (
      <button
        ref={ref}
        className={classes}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        {...props}
      >
        {content}
      </button>
    );
  },
);

export { buttonVariants };
