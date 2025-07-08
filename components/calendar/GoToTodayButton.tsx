"use client";

import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

export default function GoToTodayButton() {
  const router = useRouter();
  const todayStr = format(new Date(), "yyyy-MM-dd");

  return (
    <Button
      size={"icon"}
      variant={"secondary"}
      onClick={() => {
        router.push(`/?date=${todayStr}`);
      }}
      className="text-muted-foreground size-12 rounded-full"
    >
      <ArrowLeft strokeWidth={3} className="size-6" />
    </Button>
  );
}
