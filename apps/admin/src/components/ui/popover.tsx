import * as PopoverPrimitive from '@radix-ui/react-popover'

import { cn } from '@/lib/utils'

const Popover = PopoverPrimitive.Root
const PopoverTrigger = PopoverPrimitive.Trigger

type PopoverContentProps = React.ComponentProps<typeof PopoverPrimitive.Content>

const PopoverContent = ({ className, side = 'bottom', align = 'start', children, ...props }: PopoverContentProps) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      side={side}
      align={align}
      className={cn('z-50 min-w-[220px] rounded-md border bg-popover p-2 shadow-md', className)}
      {...props}
    >
      {children}
      <PopoverPrimitive.Arrow className="fill-popover" />
    </PopoverPrimitive.Content>
  </PopoverPrimitive.Portal>
)

export { Popover, PopoverTrigger, PopoverContent, PopoverPrimitive }
