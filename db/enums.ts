import { pgEnum } from "drizzle-orm/pg-core";

export const TASK_TYPES = ["HABIT", "TASK", "EVENT"] as const;

export const TaskType = pgEnum("task_type", TASK_TYPES);
export type TaskTypeValue = (typeof TASK_TYPES)[number];

export const WEEKDAYS = [
  "MON",
  "TUE",
  "WED",
  "THU",
  "FRI",
  "SAT",
  "SUN",
] as const;
export const Weekday = pgEnum("weekday", WEEKDAYS);
export type WeekdayValue = (typeof WEEKDAYS)[number];
