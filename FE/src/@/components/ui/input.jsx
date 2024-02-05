import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    (<input
      type={type}
      className={cn(
        "twflex twh-9 tww-full twrounded-md twborder twborder-input twbg-transparent twpx-3 twpy-1 twtext-sm twshadow-sm twtransition-colors file:twborder-0 file:twbg-transparent file:twtext-sm file:twfont-medium placeholder:twtext-muted-foreground focus-visible:twoutline-none focus-visible:twring-1 focus-visible:twring-ring disabled:twcursor-not-allowed disabled:twopacity-50",
        className
      )}
      ref={ref}
      {...props} />)
  );
})
Input.displayName = "Input"

export { Input }
