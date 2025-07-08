"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import DatePickerButton from "../calendar/DatePickerButton";
import TimeInputButton from "../calendar/TimeInputButton";
import { Input } from "../ui/input";
import { format } from "date-fns";

export function AddTaskForm() {
  const searchParams = useSearchParams();
  const paramsDate = searchParams.get("date");

  const initialDate = paramsDate ? new Date(paramsDate) : new Date();

  const [date, setDate] = useState<Date | undefined>(initialDate);
  const [time, setTime] = useState("");

  return (
    <div className="flex h-full flex-col justify-between gap-4">
      <Input
        type="text"
        name="title"
        placeholder="Task title"
        className="border-none text-xl font-semibold shadow-none md:text-xl"
        required
      />

      <div className="flex gap-2">
        <DatePickerButton date={date} onSelect={setDate} />
        <TimeInputButton
          name="start_time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
      </div>

      <input
        readOnly
        type="hidden"
        name="start_date"
        value={date ? format(date, "yyyy-MM-dd") : ""}
      />
    </div>
  );
}
