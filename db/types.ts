import type { InferSelectModel, InferInsertModel } from "drizzle-orm";

import { tasks, habits, habit_days, holidays, userSettings } from "./schema";

export type HabitDayExtras = {
  weekday: HabitDay["weekday"] | null;
  hdCompleted: HabitDay["completed"] | null;
  days: string[] | null;
};

export type Task = InferSelectModel<typeof tasks> & HabitDayExtras;
export type NewTask = InferInsertModel<typeof tasks>;

export type Habit = InferSelectModel<typeof habits>;
export type NewHabit = InferInsertModel<typeof habits>;

export type HabitDay = InferSelectModel<typeof habit_days>;
export type NewHabitDay = InferInsertModel<typeof habit_days>;

export type Holiday = InferSelectModel<typeof holidays>;
export type NewHoliday = InferInsertModel<typeof holidays>;

export type UserSettings = InferSelectModel<typeof userSettings>;
export type NewUserSettings = InferInsertModel<typeof userSettings>;
