"use client";

import { useCallback, useMemo } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { getISODay } from "date-fns";
import type { CarouselApi } from "@/components/ui/carousel";

export function useGoToToday(api?: CarouselApi) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // today’s weekday index
  const today = useMemo(() => new Date(), []);
  const todayIndex = useMemo(() => getISODay(today) - 1, [today]);

  // strip only `date` from the query, keep any other params
  const clearDateParam = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("date");
    const qs = params.toString();
    return qs ? `?${qs}` : "";
  }, [searchParams]);

  const goToToday = useCallback(() => {
    // reset carousel state to weekOffset=0 & weekdayIndex=todayIndex
    // (you’ll wire those setters up where you consume the hook)
    api?.scrollTo(1);
    router.push(pathname + clearDateParam());
  }, [api, clearDateParam, pathname, router]);

  return { goToToday, todayIndex };
}
