"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar, Moon, Star, Sun } from "lucide-react";
import { useState } from "react";
import { toggleTaskComplete } from "@/app/actions";
import { cn } from "@/lib/utils";
import EditTaskSheet from "../sheet/EditTaskSheet";
import { Task } from "@/db/types";
import { parse, format } from "date-fns";

function formatTimeHHmm(time: string) {
  const d = parse(time, "HH:mm:ss", new Date());
  return format(d, "HH:mm");
}

export default function Tasks({
  tasks,
  wakeUpTime,
  sleepTime,
  showWakeUp,
  showSleep,
}: {
  tasks: Task[];
  wakeUpTime: string;
  sleepTime: string;
  showWakeUp: boolean;
  showSleep: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  return (
    <div>
      <div className="flex flex-col gap-2">
        {showWakeUp && (
          <div className="flex flex-row items-center gap-2 border-b-2 border-dotted py-4 font-semibold">
            <Sun className="size-6 rounded-md fill-amber-400 text-amber-400" />
            <p className="text-lg">Wake up</p>
            <p className="text-muted-foreground ml-auto">
              {formatTimeHHmm(wakeUpTime)}
            </p>
          </div>
        )}
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex flex-row items-center gap-2 border-b-2 border-dotted"
          >
            {task.type === "HABIT" && (
              <Star className="size-6 rounded-md fill-yellow-400 text-yellow-400" />
            )}
            {task.type === "TASK" && (
              <Checkbox
                checked={task.completed}
                onCheckedChange={() =>
                  toggleTaskComplete(task.id, !task.completed)
                }
                className="data-[state=checked]:bg-background data-[state=checked]:text-muted-foreground data-[state=checked]:border-primary/30 size-6 rounded-md"
              />
            )}
            {task.type === "EVENT" && (
              <Calendar
                strokeWidth={2.5}
                className="text-muted-foreground size-6 rounded-md"
              />
            )}
            <button
              onClick={() => {
                setSelectedTask(task);
                setOpen(true);
              }}
              className="flex h-full w-full flex-row items-center justify-between py-4 font-semibold"
            >
              <p
                className={cn(
                  "text-lg transition",
                  task.completed && "text-muted-foreground line-through",
                )}
              >
                {task.title}
              </p>
              {task.start_time && (
                <p className="text-muted-foreground">
                  {formatTimeHHmm(task.start_time)}
                </p>
              )}
            </button>
          </div>
        ))}
        {showSleep && (
          <div className="flex flex-row items-center gap-2 border-b-2 border-dotted py-4 font-semibold">
            <Moon className="size-6 rounded-md fill-purple-500 text-purple-500" />
            <p className="text-lg">Sleep</p>
            <p className="text-muted-foreground ml-auto">
              {formatTimeHHmm(sleepTime)}
            </p>
          </div>
        )}
      </div>

      {selectedTask && (
        <EditTaskSheet
          key={selectedTask.id}
          open={open}
          setOpen={setOpen}
          task={selectedTask}
        />
      )}
    </div>
  );
}
