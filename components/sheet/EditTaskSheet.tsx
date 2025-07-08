import { Task } from "@/db/types";
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
import {
  deleteTask,
  toggleTaskComplete,
  updateHabit,
  updateTask,
} from "@/app/actions";
import { Input } from "../ui/input";
import { Dispatch, SetStateAction, useCallback, useState } from "react";
import DatePickerButton from "../calendar/DatePickerButton";
import { Clock8 } from "lucide-react";
import { format } from "date-fns";
import { WEEKDAYS } from "@/db/enums";
import { cn } from "@/lib/utils";

export default function EditTaskSheet({
  open,
  setOpen,
  task,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  task: Task | null;
}) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [date, setDate] = useState<Date>(() =>
    task?.start_date ? new Date(task.start_date) : new Date(),
  );
  const [time, setTime] = useState(task?.start_time ?? "");
  const [selectedDays, setSelectedDays] = useState<string[]>(
    task?.type === "HABIT" ? (task?.days ?? []) : [],
  );

  const toggleDay = useCallback((day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  }, []);

  if (!task) return null;

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{task.title}</DrawerTitle>
          <DrawerDescription>{task.description}</DrawerDescription>
        </DrawerHeader>
        <div className="mx-auto">
          <DrawerFooter className="flex-row">
            <Button
              size={"lg"}
              variant={"secondary"}
              onClick={() => {
                toggleTaskComplete(task.id, !task.completed);
                setOpen(false);
              }}
            >
              {task.completed ? "Undo" : "Complete"}
            </Button>
            <Drawer open={isEditOpen} onOpenChange={setIsEditOpen}>
              <DrawerTrigger asChild>
                <Button
                  size={"lg"}
                  variant={"secondary"}
                  onClick={() => setIsEditOpen(true)}
                >
                  Edit
                </Button>
              </DrawerTrigger>
              <DrawerContent className="px-4 md:px-0">
                <DrawerHeader>
                  <DrawerTitle>Edit {task.type.toLowerCase()}</DrawerTitle>
                  <DrawerDescription className="sr-only">
                    Edit {task.type.toLowerCase()} description
                  </DrawerDescription>
                </DrawerHeader>
                <div className="mx-auto w-full max-w-lg">
                  <form
                    action={
                      task.type === "HABIT"
                        ? updateHabit.bind(null, task.id.toString())
                        : updateTask.bind(null, task.id.toString())
                    }
                  >
                    <Input
                      type="text"
                      name="title"
                      defaultValue={task.title}
                      placeholder={
                        task.type === "TASK"
                          ? "Task title"
                          : task.type === "HABIT"
                            ? "Habit title"
                            : "Event title"
                      }
                      required
                    />

                    {task.type === "HABIT" && (
                      <div>
                        <div className="mt-2 grid grid-cols-7 gap-2">
                          {WEEKDAYS.map((day) => {
                            const isSelected = selectedDays.includes(day);
                            return (
                              <button
                                key={day}
                                type="button"
                                onClick={() => toggleDay(day)}
                                className={cn(
                                  "rounded-2xl px-4 py-6 text-center font-bold",
                                  isSelected
                                    ? "bg-blue-500 text-white"
                                    : "bg-muted text-muted-foreground",
                                )}
                              >
                                {day.slice(0, 3)}
                              </button>
                            );
                          })}
                          <Input
                            type="hidden"
                            name="days"
                            value={selectedDays.join(",")}
                          />
                        </div>
                      </div>
                    )}

                    {task.type !== "HABIT" && (
                      <div className="mt-2 flex gap-2">
                        <DatePickerButton date={date} onSelect={setDate} />
                        <div className="relative">
                          <Input
                            type="time"
                            name="start_time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            className="bg-secondary text-secondary-foreground h-10 rounded-md border-none pr-6 pl-10 font-bold shadow-xs"
                          />
                          <Clock8 className="absolute top-1/2 left-3 size-5 -translate-y-1/2 opacity-50" />
                        </div>

                        <Input
                          type="hidden"
                          name="start_date"
                          value={format(date, "yyyy-MM-dd")}
                        />
                      </div>
                    )}

                    <Input
                      readOnly
                      type="hidden"
                      name="type"
                      value={task.type}
                    />

                    <DrawerFooter className="px-0">
                      <DrawerClose asChild>
                        <Button
                          type="submit"
                          size={"lg"}
                          variant={"secondary"}
                          className="h-12 rounded-xl text-lg"
                          onClick={() => {
                            setIsEditOpen(false);
                            setOpen(false);
                          }}
                        >
                          Save
                        </Button>
                      </DrawerClose>
                    </DrawerFooter>
                  </form>
                </div>
              </DrawerContent>
            </Drawer>
            <Button
              size={"lg"}
              variant={"destructive"}
              onClick={() => {
                deleteTask(task.id);
                setOpen(false);
              }}
            >
              Delete
            </Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
