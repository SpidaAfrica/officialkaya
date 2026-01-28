import { cn } from "@/lib/utils";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

export function CustomTextArea({
  label,
  ...props
}: { label?: string } & React.ComponentProps<"textarea">) {
  return (
    <>
      {label && (
        <Label className="capitalize py-1" htmlFor="name">
          {label}
        </Label>
      )}
      <Textarea
        {...props}
        className={cn(
          `md:w-3/6  bg-white text-sm border border-foreground/30 placeholder:text-xs placeholder:text-gray-400 bg-background`,
          props.className
        )}
        placeholder={props.placeholder}
      />
    </>
  );
}
