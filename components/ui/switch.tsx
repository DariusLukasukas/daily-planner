"use client";

import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";

import { cn } from "@/lib/utils";

export interface SwitchProps
  extends React.ComponentProps<typeof SwitchPrimitive.Root> {
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: {
    track: "h-4 w-8",
    thumb: "size-3 data-[state=checked]:translate-x-[calc(100%-2px)] ",
  },
  md: {
    track: "h-[1.15rem] w-8",
    thumb: "size-4 data-[state=checked]:translate-x-[calc(100%-2px)]",
  },
  lg: {
    track: "h-7 w-12",
    thumb:
      "size-6 data-[state=checked]:translate-x-[calc(100%-3px)] data-[state=unchecked]:translate-x-[1px]",
  },
} as const;

function Switch({ size = "md", className, ...props }: SwitchProps) {
  const { track, thumb } = sizeMap[size];

  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "peer data-[state=checked]:bg-primary data-[state=unchecked]:bg-input focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 inline-flex shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        track,
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "bg-background dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none block rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0",
          thumb,
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
