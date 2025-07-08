"use client";
import Form from "next/form";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

import { Plus } from "lucide-react";
import { useState } from "react";
import { addHabit, addTask } from "@/app/actions";
import { AddEventForm } from "../forms/AddEventForm";
import { AddHabitForm } from "../forms/AddHabitForm";
import { AddTaskForm } from "../forms/AddTaskForm";

type Tab = "HABIT" | "TASK" | "EVENT";

export default function AddTaskSheet() {
  const [activeTab, setActiveTab] = useState<Tab>("TASK");

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          size={"lg"}
          variant={"secondary"}
          className="text-muted-foreground h-12 w-40 rounded-full"
        >
          <Plus strokeWidth={3} className="size-6" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <Form
          action={
            activeTab === "TASK"
              ? addTask
              : activeTab === "EVENT"
                ? addTask
                : addHabit
          }
        >
          <input type="hidden" name="type" value={activeTab} />
          <div className="relative mx-auto flex h-full min-h-[50vh] w-full max-w-lg flex-col">
            <DrawerHeader>
              <DrawerTitle className="sr-only hidden">
                Add {activeTab}
              </DrawerTitle>
              <DrawerDescription className="sr-only hidden">
                Add a new {activeTab}
              </DrawerDescription>
            </DrawerHeader>
            <Tabs
              value={activeTab}
              onValueChange={(v) => setActiveTab(v as Tab)}
              className="h-[40svh]"
            >
              <TabsList className="bg-background mx-auto p-0">
                <TabsTrigger
                  value="HABIT"
                  className="data-[state=active]:bg-secondary text-lg data-[state=active]:shadow-none"
                >
                  Habit
                </TabsTrigger>
                <TabsTrigger
                  value="TASK"
                  className="data-[state=active]:bg-secondary text-lg data-[state=active]:shadow-none"
                >
                  Task
                </TabsTrigger>
                <TabsTrigger
                  value="EVENT"
                  className="data-[state=active]:bg-secondary text-lg data-[state=active]:shadow-none"
                >
                  Event
                </TabsTrigger>
              </TabsList>

              <TabsContent value="HABIT" className="p-4">
                <AddHabitForm />
              </TabsContent>
              <TabsContent value="TASK" className="p-4">
                <AddTaskForm />
              </TabsContent>
              <TabsContent value="EVENT" className="p-4">
                <AddEventForm />
              </TabsContent>
            </Tabs>
            <DrawerFooter>
              <DrawerClose asChild>
                <Button
                  type="submit"
                  size={"lg"}
                  variant={"secondary"}
                  className="h-12 rounded-xl text-lg"
                >
                  Add
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </Form>
      </DrawerContent>
    </Drawer>
  );
}
