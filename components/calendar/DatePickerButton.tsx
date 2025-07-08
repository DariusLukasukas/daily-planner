import { CalendarIcon } from "lucide-react";
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
import { Calendar } from "../ui/calendar";
import { format, isToday, isTomorrow, isYesterday } from "date-fns";

export default function DatePickerButton({
  date,
  onSelect,
}: {
  date?: Date;
  onSelect: (d: Date) => void;
}) {
  let label = "Today";
  if (date) {
    if (isToday(date)) label = "Today";
    else if (isYesterday(date)) label = "Yesterday";
    else if (isTomorrow(date)) label = "Tomorrow";
    else label = format(date, "P");
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="secondary" size="lg">
          <CalendarIcon className="size-5 opacity-50" />
          {label}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-lg">
          <DrawerHeader>
            <DrawerTitle>Choose date</DrawerTitle>
          </DrawerHeader>
          <DrawerDescription className="sr-only hidden">
            Select a date to plan your daily activities.
          </DrawerDescription>
          <div className="flex justify-center">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(date) => {
                onSelect(date || new Date());
              }}
              captionLayout="dropdown"
              className="[--cell-size:--spacing(15)]"
            />
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button
                size="lg"
                variant="secondary"
                className="h-12 rounded-xl text-lg"
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
