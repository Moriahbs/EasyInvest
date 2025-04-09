import * as React from "react"
import { cn } from "@/lib/utils"

type MultiSelectProps = {
  options: string[]
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
  className?: string
}

export const MultiSelect = React.forwardRef<HTMLDivElement, MultiSelectProps>(
  ({ options, value, onChange, placeholder, className }, ref) => {
    const [open, setOpen] = React.useState(false)

    const toggleValue = (val: string) => {
      if (value.includes(val)) {
        onChange(value.filter((v) => v !== val))
      } else {
        onChange([...value, val])
      }
    }

    return (
      <div className="relative" ref={ref}>
        <div
          onClick={() => setOpen(!open)}
          className={cn(
            "flex h-9 w-full cursor-pointer items-center justify-between rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            className
          )}
        >
          <span className="truncate">
            {value.length > 0 ? value.join(", ") : placeholder}
          </span>
        </div>

        {open && (
          <div className="absolute z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-md border border-input bg-background shadow-md">
            {options.map((option) => (
              <div
                key={option}
                className="flex cursor-pointer items-center gap-2 px-3 py-2 hover:bg-muted"
                onClick={() => toggleValue(option)}
              >
                <input
                  type="checkbox"
                  checked={value.includes(option)}
                  readOnly
                />
                <span>{option}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }
)

MultiSelect.displayName = "MultiSelect"
