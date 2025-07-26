import * as React from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface TooltipWrapperProps {
  content: string
  children: React.ReactNode
  disabled?: boolean
  side?: "top" | "right" | "bottom" | "left"
  className?: string
}

export const TooltipWrapper: React.FC<TooltipWrapperProps> = ({
  content,
  children,
  disabled = false,
  side = "top",
  className
}) => {
  if (disabled || !content) {
    return <>{children}</>
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild className={className}>
          {children}
        </TooltipTrigger>
        <TooltipContent side={side}>
          <p className="max-w-xs text-sm">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}