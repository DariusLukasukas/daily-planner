import { Calendar } from "lucide-react";
import { Button } from "../ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { Input } from "../ui/input";

const OPTIONS = [
  {
    icon: <Calendar strokeWidth={3} className="text-muted-foreground size-5" />,
    label: "Every day",
    value: ["MON,", "TUE,", "WED,", "THU,", "FRI,", "SAT,", "SUN,"],
  },
  {
    icon: <Calendar strokeWidth={3} className="text-muted-foreground size-5" />,
    label: "Every weekday",
    value: ["MON,", "TUE,", "WED,", "THU,", "FRI,"],
  },
  {
    icon: <Calendar strokeWidth={3} className="text-muted-foreground size-5" />,
    label: "Every weekend",
    value: ["SAT,", "SUN,"],
  },
  {
    icon: <Calendar strokeWidth={3} className="text-muted-foreground size-5" />,
    label: "Custom",
    onClick: () => {},
  },
];

export default function RepeatSheet() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="secondary" size="lg">
          Repeat
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Repeat</DrawerTitle>
          <DrawerDescription className="sr-only hidden">
            Repeat the task
          </DrawerDescription>
        </DrawerHeader>
        <div className="relative mx-auto flex h-full min-h-[50vh] w-full max-w-lg flex-col">
          {OPTIONS.map((option, i) => (
            <div
              key={option.label + i}
              className="border-b-2 border-dashed p-4"
            >
              <div className="flex flex-row items-center justify-between gap-2 text-xl font-semibold">
                <div className="flex items-center gap-3">
                  {option.icon}
                  <label>{option.label}</label>
                </div>
                <Input
                  type="checkbox"
                  name="habitDays"
                  value={option.value}
                  className="size-10 rounded-3xl"
                />
              </div>
            </div>
          ))}
          <DrawerFooter>
            <DrawerClose asChild>
              <Button
                size={"lg"}
                variant={"secondary"}
                className="h-13 rounded-xl text-lg"
              >
                Save
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
