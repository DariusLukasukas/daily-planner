import {
  pgTable,
  pgEnum,
  serial,
  integer,
  text,
  varchar,
  date,
  time,
  timestamp,
  boolean,
  primaryKey,
} from "drizzle-orm/pg-core";
import { TaskType } from "./enums";

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

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  type: TaskType("type").notNull(),
  completed: boolean("completed").notNull().default(false),
  start_date: date("start_date").notNull(),
  start_time: time("start_time"),
  end_date: date("end_date"),
  end_time: time("end_time"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const habits = pgTable("habits", {
  task_id: integer("task_id")
    .primaryKey()
    .references(() => tasks.id, { onDelete: "cascade" })
    .notNull(),
});

export const habit_days = pgTable(
  "habit_days",
  {
    habit_id: integer("habit_id")
      .references(() => habits.task_id, { onDelete: "cascade" })
      .notNull(),
    weekday: Weekday("weekday").notNull(),
    completed: boolean("completed").notNull().default(false),
  },
  (table) => [primaryKey({ columns: [table.habit_id, table.weekday] })],
);

export const holidays = pgTable("holidays", {
  id: serial("id").primaryKey(),
  country: varchar("country", { length: 2 }).notNull(),
  region: varchar("region", { length: 10 }),
  name: varchar("name", { length: 255 }).notNull(),
  date: date("date").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userSettings = pgTable("user_settings", {
  id: serial("id").primaryKey(),
  wakeUpTime: time("wake_up_time").notNull().default("07:00"),
  sleepTime: time("sleep_time").notNull().default("23:00"),
  showWakeUp: boolean("show_wake_up").notNull().default(true),
  showSleep: boolean("show_sleep").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
