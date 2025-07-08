import { Clock8 } from "lucide-react";
import { Input } from "../ui/input";

interface TimeInputProps {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function TimeInputButton({
  name,
  value,
  onChange,
}: TimeInputProps) {
  return (
    <div className="relative">
      <Input
        type="time"
        name={name}
        value={value}
        onChange={onChange}
        className="bg-secondary text-secondary-foreground h-10 rounded-md border-none pr-6 pl-10 font-bold shadow-xs"
      />
      <Clock8 className="absolute top-1/2 left-3 size-5 -translate-y-1/2 opacity-50" />
    </div>
  );
}
