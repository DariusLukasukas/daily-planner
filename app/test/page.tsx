import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import TimeSlider from "./componenets/TimeSlider";
import { Button } from "@/components/ui/button";

export default function Page() {
  return (
    <div>
      <Drawer>
        <DrawerTrigger asChild>
          <Button size={"lg"} variant={"secondary"}>
            Open Drawer
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Time</DrawerTitle>
            <DrawerDescription className="sr-only">
              Choose time
            </DrawerDescription>
          </DrawerHeader>
          <div className="mx-auto w-full max-w-md">
            <TimeSlider />
            <DrawerFooter>
              <Button
                size={"lg"}
                variant={"secondary"}
                className="h-12 w-full rounded-xl text-lg"
              >
                Save
              </Button>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
