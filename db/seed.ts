import "dotenv/config";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { tasks, userSettings } from "./schema";

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
const db = drizzle(pool);

async function main() {
  type newTask = typeof tasks.$inferInsert;
  const dummyTasks: newTask[] = [
    {
      title: "Daily standup meeting",
      description: "Join Zoom at 9 AM CET",
      type: "TASK",
      start_date: "2025-06-24",
      start_time: "09:00:00",
      completed: false,
    },
    {
      title: "Water the plants",
      description: "Living room and balcony",
      type: "HABIT",
      start_date: "2025-06-24",
      start_time: null,
      completed: false,
    },
    {
      title: "Project launch event",
      description: "Deliver slides and demo",
      type: "EVENT",
      start_date: "2025-06-24",
      start_time: null,
      completed: false,
    },
  ];

  for (const task of dummyTasks) {
    await db.insert(tasks).values(task);
  }

  type NewSettings = typeof userSettings.$inferInsert;
  const defaultSettings: NewSettings = {
    wakeUpTime: "07:00:00",
    sleepTime: "23:00:00",
    showWakeUp: true,
    showSleep: true,
  };
  await db.insert(userSettings).values(defaultSettings);

  console.log("Seed complete!");
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
