import * as React from "react"

import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: 'default' | 'modern' | 'glass' | 'gradient' | 'elevated'
  }
>(({ className, variant = 'default', ...props }, ref) => {
  const variants = {
    default: "rounded-xl border bg-card text-card-foreground shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5",
    modern: "rounded-3xl bg-white/98 dark:bg-slate-800/95 backdrop-blur-xl border border-white/60 dark:border-slate-700/60 shadow-2xl hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.15)] transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] group relative overflow-hidden",
    glass: "rounded-3xl backdrop-blur-2xl bg-white/15 dark:bg-black/15 border border-white/30 dark:border-white/20 shadow-2xl hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] transition-all duration-500 hover:-translate-y-1",
    gradient: "rounded-3xl bg-gradient-to-br from-white/98 via-stone-50/95 to-amber-50/90 dark:from-slate-800 dark:via-slate-800 dark:to-slate-900 border border-stone-200/70 dark:border-slate-700/50 shadow-2xl hover:shadow-[0_20px_40px_-12px_rgba(251,146,60,0.15)] transition-all duration-500 hover:-translate-y-2",
    elevated: "rounded-3xl bg-gradient-to-br from-card to-white dark:from-slate-800 dark:to-slate-900 border-0 shadow-2xl hover:shadow-[0_35px_60px_-12px_rgba(0,0,0,0.25)] transition-all duration-700 hover:-translate-y-3 hover:scale-[1.03] relative overflow-hidden"
  }
  
  return (
    <div
      ref={ref}
      className={cn(variants[variant], className)}
      {...props}
    >
      {variant === 'modern' && (
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
      )}
      {props.children}
    </div>
  )
})
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-2 p-6 sm:p-8", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-xl sm:text-2xl font-bold leading-tight tracking-tight bg-gradient-to-r from-slate-900 via-blue-700 to-purple-700 dark:from-white dark:via-blue-300 dark:to-purple-300 bg-clip-text text-transparent",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 sm:p-8 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 sm:p-8 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
