"use client";

import GoToTodayButton from "../calendar/GoToTodayButton";
import SettingsSheet from "../sheet/SettingsSheet";
import { UserSettings } from "@/db/types";
import AddTaskSheet from "../sheet/AddTaskSheet";

export default function Navigation({
  userSettings,
}: {
  userSettings: UserSettings;
}) {
  return (
    <div className="fixed bottom-6 left-1/2 w-full max-w-2xl -translate-x-1/2 px-4">
      <div className="flex w-full items-center justify-center">
        <nav className="flex w-full items-center justify-between">
          <SettingsSheet settings={userSettings} />
          <AddTaskSheet />
          <GoToTodayButton />
        </nav>
      </div>
    </div>
  );
}
