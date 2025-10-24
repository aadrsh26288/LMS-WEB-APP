import * as React from "react";

import { cn } from "@/lib/utils";

const ScrollArea = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("relative overflow-hidden", className)}
      {...props}
    />
  )
);
ScrollArea.displayName = "ScrollArea";

const ScrollViewport = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("h-full w-full overflow-y-auto", className)}
    {...props}
  />
));
ScrollViewport.displayName = "ScrollViewport";

export { ScrollArea, ScrollViewport };
