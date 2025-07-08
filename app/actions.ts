"use server";

import { tasks, habits, habit_days, userSettings } from "@/db/schema";
import { db } from "@/db";
import { asc, eq, or, and, ne, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { isValid, parseISO, format } from "date-fns";
import { WEEKDAYS, type WeekdayValue, type TaskTypeValue } from "@/db/enums";

export async function getTasksByDate(date: string) {
  const raw = format(parseISO(date), "EEE").toUpperCase();
  const weekday = raw as WeekdayValue;

  return await db
    .select({
      id: tasks.id,
      title: tasks.title,
      description: tasks.description,
      type: tasks.type,
      completed: tasks.completed,
      start_date: tasks.start_date,
      start_time: tasks.start_time,
      end_date: tasks.end_date,
      end_time: tasks.end_time,
      createdAt: tasks.createdAt,
      updatedAt: tasks.updatedAt,
      weekday: habit_days.weekday,
      hdCompleted: habit_days.completed,
      days: sql<string[]>`
         coalesce(
           (select json_agg(weekday ORDER BY
               case
                 when weekday='MON' then 1
                 when weekday='TUE' then 2
                 when weekday='WED' then 3
                 when weekday='THU' then 4
                 when weekday='FRI' then 5
                 when weekday='SAT' then 6
                 when weekday='SUN' then 7
               end
            )
            from habit_days
            where habit_days.habit_id = tasks.id
           ), '[]'::json
         )
       `,
    })
    .from(tasks)
    .leftJoin(habits, eq(habits.task_id, tasks.id))
    .leftJoin(habit_days, eq(habit_days.habit_id, tasks.id))
    .where(
      or(
        and(ne(tasks.type, "HABIT"), eq(tasks.start_date, date)),
        and(eq(tasks.type, "HABIT"), eq(habit_days.weekday, weekday)),
      ),
    )
    .orderBy(asc(tasks.start_time), asc(tasks.createdAt));
}

export async function toggleTaskComplete(id: number, completed: boolean) {
  await db.update(tasks).set({ completed }).where(eq(tasks.id, id));

  revalidatePath("/");
}

export async function deleteTask(id: number) {
  await db.delete(tasks).where(eq(tasks.id, id));

  revalidatePath("/");
}

export async function addTask(formData: FormData) {
  const title = formData.get("title") as string;
  const date = formData.get("start_date") as string; // // "YYYY-MM-DD"
  const time = (formData.get("start_time") as string) ?? null; // "" or "HH:MM"
  const type = (formData.get("type") as string).toUpperCase() as TaskTypeValue;

  const parsed = parseISO(date);
  if (!isValid(parsed)) {
    throw new Error("Invalid date format. Expected YYYY-MM-DD");
  }
  const start_time = time.trim() !== "" ? time : null;

  await db.insert(tasks).values({
    title: title,
    type: type,
    start_date: date,
    start_time: start_time,
  });

  revalidatePath("/");
}

export async function updateTask(id: string, formData: FormData) {
  const rawFormData = {
    title: formData.get("title") as string,
    type: formData.get("type") as TaskTypeValue,
    start_date: formData.get("start_date") as string,
    start_time: formData.get("start_time") as string,
  };

  await db
    .update(tasks)
    .set(rawFormData)
    .where(eq(tasks.id, Number(id)));

  revalidatePath("/");
}

export async function updateHabit(id: string, formData: FormData) {
  const habitID = Number(id);

  const rawFormData = {
    title: formData.get("title") as string,
    type: formData.get("type") as TaskTypeValue,
  };

  const rawDays = (formData.get("days") as string | null) ?? "";
  const selectedWeekdays = rawDays
    .split(",")
    .map((d) => d.trim())
    .filter((d): d is WeekdayValue => WEEKDAYS.includes(d as WeekdayValue));

  await db.transaction(async (tx) => {
    await tx.update(tasks).set(rawFormData).where(eq(tasks.id, habitID));

    await tx.delete(habit_days).where(eq(habit_days.habit_id, habitID));

    if (selectedWeekdays.length > 0) {
      const inserts = selectedWeekdays.map((weekday) => ({
        habit_id: habitID,
        weekday,
      }));
      await tx.insert(habit_days).values(inserts);
    }
  });
  revalidatePath("/");
}

function isWeekday(d: string): d is WeekdayValue {
  return (WEEKDAYS as readonly string[]).includes(d);
}

export async function addHabit(formData: FormData) {
  const title = formData.get("title") as string;
  const days = formData.get("days") as string;
  const type = formData.get("type") as string;

  const weekdays = days
    .split(",")
    .map((d) => d.trim())
    .filter(isWeekday);

  if (weekdays.length === 0) {
    throw new Error("No valid weekdays selected");
  }
  const today = format(new Date(), "yyyy-MM-dd");
  await db.transaction(async (tx) => {
    const [{ id: taskId }] = await tx
      .insert(tasks)
      .values({
        title,
        type: type as TaskTypeValue,
        start_date: today,
        start_time: null,
        completed: false,
      })
      .returning({ id: tasks.id });

    await tx.insert(habits).values({ task_id: taskId });

    const rows: (typeof habit_days.$inferInsert)[] = weekdays.map(
      (weekday) => ({
        habit_id: taskId,
        weekday,
      }),
    );
    await tx.insert(habit_days).values(rows);
  });

  revalidatePath("/");
}

export async function getUserSettings(id: number) {
  return await db.select().from(userSettings).where(eq(userSettings.id, id));
}

export async function toggleShowWakeUp(id: number, show: boolean) {
  await db
    .update(userSettings)
    .set({ showWakeUp: show })
    .where(eq(userSettings.id, id));

  revalidatePath("/");
}

export async function toggleShowSleepTime(id: number, show: boolean) {
  await db
    .update(userSettings)
    .set({ showSleep: show })
    .where(eq(userSettings.id, id));

  revalidatePath("/");
}

export async function updateUserSettings(formData: FormData) {
  const id = Number(formData.get("id"));
  const sleepTime = formData.get("sleepTime") as string;
  const wakeUpTime = formData.get("wakeUpTime") as string;

  await db
    .update(userSettings)
    .set({ wakeUpTime, sleepTime })
    .where(eq(userSettings.id, id));

  revalidatePath("/");
}
