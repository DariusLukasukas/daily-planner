"use client";
import { WEEKDAYS } from "@/db/enums";
import { Input } from "../ui/input";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function AddHabitForm() {
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  };

  return (
    <div className="flex h-full flex-col justify-between gap-4">
      <Input
        type="text"
        name="title"
        placeholder="Habit title"
        className="border-none text-xl font-semibold shadow-none md:text-xl"
        required
      />

      <div className="grid grid-cols-7 gap-2">
        {WEEKDAYS.map((day) => {
          const isSelected = selectedDays.includes(day);
          return (
            <button
              key={day}
              type="button"
              onClick={() => toggleDay(day)}
              className={cn(
                "rounded-3xl px-4 py-6 text-center font-bold",
                isSelected
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground",
              )}
            >
              {day.slice(0, 1)}
            </button>
          );
        })}
      </div>
      <input
        type="hidden"
        name="days"
        value={selectedDays.join(",")}
        required
      />
    </div>
  );
}
