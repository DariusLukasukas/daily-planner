"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  format,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  addWeeks,
  getISODay,
  addDays,
  isSameDay,
  parseISO,
  differenceInCalendarWeeks,
  isValid,
} from "date-fns";
import { enUS } from "date-fns/locale";
import { cn } from "@/lib/utils";

export default function WeekdaySlider() {
  const today = useMemo(() => new Date(), []);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // base Monday of *this* week
  const baseMonday = startOfWeek(today, { weekStartsOn: 1, locale: enUS });

  // derive the URL param once
  const dateParam = searchParams.get("date");

  // state = week offset & day index
  const [weekOffset, setWeekOffset] = useState(0);
  const [weekdayIndex, setWeekdayIndex] = useState(getISODay(today) - 1);

  // carousel API
  const [api, setApi] = useState<CarouselApi>();

  // mark that the user has *manually* swiped or clicked
  const hasUserInteractedRef = useRef(false);

  // whenever dateParam changes (on mount, refresh, back/forward),
  // parse it and update weekOffset+weekdayIndex
  useEffect(() => {
    if (!dateParam) return; // no date → do nothing
    const parsed = parseISO(dateParam);
    if (!isValid(parsed)) return;

    // compute Monday of that week, then offset from this week's Monday
    const mondayOfParam = startOfWeek(parsed, {
      weekStartsOn: 1,
      locale: enUS,
    });
    const offset = differenceInCalendarWeeks(mondayOfParam, baseMonday);
    setWeekOffset(offset);
    setWeekdayIndex(getISODay(parsed) - 1);
  }, [dateParam, baseMonday]);

  // build the three slides
  const slides = useMemo(
    () => [-1, 0, 1].map((d) => addWeeks(baseMonday, weekOffset + d)),
    [baseMonday, weekOffset],
  );

  // helper to merge a name/value into current searchParams
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const p = new URLSearchParams(searchParams.toString());
      p.set(name, value);
      return p.toString();
    },
    [searchParams],
  );

  // SWIPE handler: purely update state + URL
  useEffect(() => {
    if (!api) return;
    api.scrollTo(1);

    const onSelect = () => {
      const idx = api.selectedScrollSnap(); // 0,1,2
      const delta = idx - 1;
      if (delta === 0) return;

      hasUserInteractedRef.current = true;
      const newOffset = weekOffset + delta;
      setWeekOffset(newOffset);
      api.scrollTo(1);

      // compute new selectedDate and replace URL
      const newWeekStart = addWeeks(baseMonday, newOffset);
      const newSelectedDate = addDays(newWeekStart, weekdayIndex);
      const qs = createQueryString(
        "date",
        format(newSelectedDate, "yyyy-MM-dd"),
      );
      router.replace(`${pathname}?${qs}`);
    };

    api.on("select", onSelect);
    return () => void api.off("select", onSelect);
  }, [
    api,
    weekOffset,
    weekdayIndex,
    baseMonday,
    createQueryString,
    pathname,
    router,
  ]);

  // figure out which date is highlighted
  const currentWeekStart = slides[1];
  const selectedDate = addDays(currentWeekStart, weekdayIndex);

  return (
    <div>
      {/* Header */}
      <div className="flex w-full flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-2">
          <p className="cursor-pointer text-2xl font-bold">
            {format(selectedDate, "EEEE", { locale: enUS })}
          </p>
          {isSameDay(selectedDate, today) && (
            <span className="inline-block size-4 rounded-full bg-blue-500" />
          )}
        </div>
        <div>
          <p className="text-muted-foreground text-xl font-semibold">
            {format(selectedDate, "d MMMM yyyy", { locale: enUS })}
          </p>
        </div>
      </div>

      {/* Carousel */}
      <Carousel
        className="mt-4 w-full"
        opts={{ align: "center", loop: true, startIndex: 1 }}
        setApi={setApi}
      >
        <CarouselContent>
          {slides.map((weekStart) => {
            const days = eachDayOfInterval({
              start: weekStart,
              end: endOfWeek(weekStart, { weekStartsOn: 1, locale: enUS }),
            });

            return (
              <CarouselItem key={weekStart.toISOString()}>
                <div className="grid w-full grid-cols-7">
                  {days.map((day, i) => (
                    <button
                      key={day.toISOString()}
                      className={cn(
                        "relative flex flex-col items-center justify-center rounded-xl border py-4 md:p-4",
                        i === weekdayIndex
                          ? "border-2"
                          : "text-muted-foreground border-2 border-transparent",
                      )}
                      onClick={() => {
                        hasUserInteractedRef.current = true;
                        setWeekdayIndex(i);

                        const dateStr = format(day, "yyyy-MM-dd");
                        router.push(
                          `${pathname}?${createQueryString("date", dateStr)}`,
                        );
                      }}
                    >
                      {isSameDay(day, today) && i !== weekdayIndex && (
                        <span className="absolute left-1/2 mx-auto block size-2 -translate-x-1/2 -translate-y-8 rounded-full bg-blue-500" />
                      )}
                      <p className="text-xl font-bold">{format(day, "d")}</p>
                      <p
                        className={cn(
                          "font-semibold",
                          i === weekdayIndex
                            ? "text-blue-500"
                            : "text-muted-foreground",
                        )}
                      >
                        {format(day, "EEE", { locale: enUS })}
                      </p>
                    </button>
                  ))}
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious className="text-muted-foreground hidden h-full w-10 rounded-md border-none shadow-none md:flex" />
        <CarouselNext className="text-muted-foreground hidden h-full w-10 rounded-md border-none shadow-none md:flex" />
      </Carousel>
    </div>
  );
}
