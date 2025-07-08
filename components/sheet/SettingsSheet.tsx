"use client";

import { Moon, Palette, Sparkle, Sun } from "lucide-react";
import { Button } from "../ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";
import ThemeSwitch from "../ui/theme-switch";
import { Label } from "../ui/label";
import { useState } from "react";
import { UserSettings } from "@/db/types";
import {
  toggleShowSleepTime,
  toggleShowWakeUp,
  updateUserSettings,
} from "@/app/actions";
import { SparklesCore } from "../ui/sparkles";
import Form from "next/form";

export default function SettingsSheet({
  settings,
}: {
  settings: UserSettings;
}) {
  const [showSleep, setShowSleep] = useState(settings.showSleep);
  const [showWakeUp, setShowWakeUp] = useState(settings.showWakeUp);

  const [changesMade, setChangesMade] = useState(false);

  const [wakeUpTime, setWakeUpTime] = useState(settings.wakeUpTime.slice(0, 5));
  const [sleepTime, setSleepTime] = useState(settings.sleepTime.slice(0, 5));

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          size={"lg"}
          variant={"secondary"}
          className="text-muted-foreground size-12 rounded-full"
        >
          <svg
            viewBox="0 0 18 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="size-6"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M0 6.66986C0 5.58603 0.58459 4.58648 1.52924 4.05512L7.5292 0.680181C8.4425 0.166501 9.5575 0.166501 10.4708 0.680191L16.4708 4.05515C17.4154 4.5865 18 5.58606 18 6.66989V13.3305C18 14.4143 17.4154 15.4139 16.4708 15.9452L10.4707 19.3202C9.5575 19.8338 8.4425 19.8338 7.5293 19.3202L1.52931 15.9455C0.58463 15.4142 0 14.4146 0 13.3307V6.66986ZM5.50003 10C5.50003 8.067 7.067 6.5 9 6.5C10.933 6.5 12.5 8.067 12.5 10C12.5 11.933 10.933 13.5 9 13.5C7.067 13.5 5.50003 11.933 5.50003 10Z"
              fill="currentColor"
            />
          </svg>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Settings</DrawerTitle>
        </DrawerHeader>
        <DrawerDescription className="sr-only hidden">
          Adjust settings
        </DrawerDescription>
        <Form
          action={updateUserSettings}
          className="relative mx-auto flex min-h-[70vh] w-full flex-col gap-2 px-4 md:max-w-md md:px-0"
        >
          <Input type="hidden" name="id" value={settings.id} />
          <div className="relative flex h-32 w-full items-center justify-center overflow-hidden rounded-4xl bg-gradient-to-t from-sky-400 to-blue-500">
            <div className="absolute inset-0 z-0 h-full w-full mask-t-to-[99%]">
              <SparklesCore
                id="particlesfullcard"
                background="transparent"
                minSize={1}
                maxSize={1.5}
                particleDensity={100}
                particleColor="#FFFFFF"
                className="h-full w-full"
              />
            </div>
            <div className="z-20 flex flex-row items-center gap-4 p-6">
              <Sparkle className="size-13 fill-neutral-100 text-neutral-100" />
              <div>
                <p className="text-xl font-bold text-white">Join Pro</p>
                <p className="text-lg font-semibold text-white/70">
                  Subscription or one-time purchase
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex flex-row items-center justify-between border-b-2 border-dashed py-4">
              <div className="flex items-center gap-3">
                <Sun className="size-6 rounded-md fill-amber-400 text-amber-400" />
                <Label className="text-lg font-semibold">Wake up</Label>
              </div>
              <div className="flex items-center gap-3">
                {showWakeUp && (
                  <Input
                    type="time"
                    name="wakeUpTime"
                    defaultValue={wakeUpTime}
                    onChange={(e) => {
                      const value = e.target.value;
                      setWakeUpTime(value);
                      if (value !== settings.wakeUpTime.slice(0, 5)) {
                        setChangesMade(true);
                      } else if (
                        sleepTime.slice(0, 5) === settings.sleepTime.slice(0, 5)
                      ) {
                        setChangesMade(false);
                      }
                    }}
                    className="bg-muted h-7 border-none px-2 font-semibold shadow-none"
                  />
                )}
                <Switch
                  size={"lg"}
                  checked={showWakeUp}
                  onCheckedChange={async (next) => {
                    setShowWakeUp(next);
                    await toggleShowWakeUp(settings.id, next);
                  }}
                  className="data-[state=checked]:bg-green-500"
                />
              </div>
            </div>
            <div className="flex flex-row items-center justify-between border-b-2 border-dashed py-4">
              <div className="flex items-center gap-3">
                <Moon className="size-6 rounded-md fill-purple-500 text-purple-500" />
                <Label className="text-lg font-semibold">Wind down</Label>
              </div>
              <div className="flex items-center gap-3">
                {showSleep && (
                  <Input
                    type="time"
                    name="sleepTime"
                    defaultValue={sleepTime}
                    onChange={(e) => {
                      const value = e.target.value;
                      const sleepingTime = settings.sleepTime.slice(0, 5); // 00:00
                      setSleepTime(value);
                      if (value !== sleepingTime) {
                        setChangesMade(true);
                      } else if (
                        wakeUpTime.slice(0, 5) ===
                        settings.wakeUpTime.slice(0, 5)
                      ) {
                        setChangesMade(false);
                      }
                    }}
                    className="bg-muted h-7 border-none px-2 font-semibold shadow-none"
                  />
                )}
                <Switch
                  size={"lg"}
                  checked={showSleep}
                  onCheckedChange={async (next) => {
                    setShowSleep(next);
                    await toggleShowSleepTime(settings.id, next);
                  }}
                  className="data-[state=checked]:bg-green-500"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <Palette className="size-6 rounded-md" />
              <Label className="text-lg font-semibold">Theme mode</Label>
            </div>
            <ThemeSwitch />
          </div>
          {changesMade ? (
            <DrawerFooter>
              <DrawerClose asChild>
                <Button
                  type="submit"
                  size={"lg"}
                  variant={"secondary"}
                  className="h-13 rounded-xl text-lg"
                >
                  Save
                </Button>
              </DrawerClose>
            </DrawerFooter>
          ) : null}
        </Form>
      </DrawerContent>
    </Drawer>
  );
}
