import * as React from "react"

import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: 'default' | 'modern' | 'glass' | 'gradient' | 'elevated'
  }
>(({ className, variant = 'default', ...props }, ref) => {
  const variants = {
    default: "rounded-2xl border bg-card text-card-foreground shadow-enterprise hover:shadow-enterprise-lg transition-all duration-500 hover:-translate-y-1 card-enterprise",
    modern: "card-enterprise shadow-enterprise-lg hover:shadow-glow-blue transition-all duration-700 hover:-translate-y-3 hover:scale-[1.02] group relative overflow-hidden",
    glass: "glass-ultra rounded-3xl shadow-enterprise-lg hover:shadow-glow-purple transition-all duration-700 hover:-translate-y-2",
    gradient: "rounded-3xl gradient-enterprise shadow-enterprise-lg hover:shadow-glow-blue transition-all duration-700 hover:-translate-y-3 hover:scale-[1.02]",
    elevated: "neomorphism rounded-3xl shadow-enterprise-lg hover:shadow-glow-purple transition-all duration-700 hover:-translate-y-4 hover:scale-[1.03] relative overflow-hidden"
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
