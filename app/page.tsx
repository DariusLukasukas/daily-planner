import Tasks from "@/components/calendar/Tasks";
import { getTasksByDate, getUserSettings } from "./actions";
import { format } from "date-fns";
import WeekdaySlider from "@/components/calendar/WeekdaySlider";

type SearchParams = Promise<{ [key: string]: string | undefined }>;

export default async function Home(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams;

  const date = searchParams.date ?? format(new Date(), "yyyy-MM-dd");

  const [tasks, [settings]] = await Promise.all([
    getTasksByDate(date),
    getUserSettings(1),
  ]);

  return (
    <div className="mb-20 flex flex-col gap-3">
      <WeekdaySlider />
      <div className="border-b-2 border-dotted" />
      <Tasks
        tasks={tasks}
        wakeUpTime={settings.wakeUpTime}
        sleepTime={settings.sleepTime}
        showWakeUp={settings.showWakeUp}
        showSleep={settings.showSleep}
      />
    </div>
  );
}
