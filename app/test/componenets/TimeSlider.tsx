"use client";
import { useRef, useState, useLayoutEffect, useMemo, useCallback } from "react";
import { FixedSizeList as List } from "react-window";
import NumberFlow, { NumberFlowGroup } from "@number-flow/react";
import { Button } from "@/components/ui/button";
import debounce from "lodash.debounce";

const STEP = 5; // minutes per tick
const STEPS_PER_DAY = 1440 / STEP; // 288
const LOOP = 3;
const ITEM_SIZE = 34; // 34px + 4px gap
const TOTAL = STEPS_PER_DAY * LOOP;

function formatTime(index: number) {
  const minuteOfDay = (index % STEPS_PER_DAY) * STEP;
  const h = Math.floor(minuteOfDay / 60);
  const m = minuteOfDay % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function getNowIndex() {
  const now = new Date();
  const minutes = now.getHours() * 60 + now.getMinutes();
  const stepIndex = Math.round(minutes / STEP); // round to nearest step
  return STEPS_PER_DAY * Math.floor(LOOP / 2) + stepIndex;
}

const mod = (n: number, m: number): number => ((n % m) + m) % m;

const TIME_OPTIONS = [
  { label: "15min", value: 15 },
  { label: "30min", value: 30 },
  { label: "45min", value: 45 },
  { label: "1 hour", value: 60 },
  // { label: "2 hours", value: 120 },
];

export default function TimeSlider() {
  const listRef = useRef<List>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const snapTimeout = useRef<NodeJS.Timeout | null>(null);

  const [width, setWidth] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(getNowIndex());

  // which TIME_OPTIONS.value is active, or null if none
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  // remember the index at the moment of first selection
  const baseIndexRef = useRef<number | null>(null);

  const selectedIdxRef = useRef<number>(selectedIndex);
  useLayoutEffect(() => {
    selectedIdxRef.current = selectedIndex;
  }, [selectedIndex]);

  /* Measure width on mount and resize */
  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    function updateWidth() {
      setWidth(el!.clientWidth);
    }
    updateWidth();
    const observer = new window.ResizeObserver(updateWidth);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  /* Center on mount and re-center on resize */
  const hasCentered = useRef(false);
  useLayoutEffect(() => {
    if (width === null) return;
    if (!hasCentered.current) {
      listRef.current?.scrollToItem(selectedIdxRef?.current, "center");
      hasCentered.current = true;
    } else {
      // On subsequent resizes, keep the same selectedIndex centered
      listRef.current?.scrollToItem(selectedIdxRef.current, "center");
    }
  }, [width]);

  useLayoutEffect(() => {
    selectedIdxRef.current = selectedIndex;
  }, [selectedIndex]);

  // Create the debounced setter exactly once
  const debouncedUpdateIndex = useMemo(
    () =>
      debounce((idx: number) => {
        // read the freshest value from the ref
        if (idx !== selectedIdxRef.current) {
          setSelectedIndex(idx);
        }
      }, 16), // 60fps
    [], // this lives for the component's lifetime
  );

  // on unmount, cancel the debouncer & any pending snap
  useLayoutEffect(() => {
    return () => {
      debouncedUpdateIndex.cancel();
      if (snapTimeout.current) clearTimeout(snapTimeout.current);
    };
  }, [debouncedUpdateIndex]);

  /* Scroll snapping logic */
  const handleScroll = useCallback(
    ({ scrollOffset }: { scrollOffset: number }) => {
      if (snapTimeout.current) clearTimeout(snapTimeout.current);

      const centerIdx = Math.round(
        (scrollOffset + (width ?? 0) / 2 - ITEM_SIZE / 2) / ITEM_SIZE,
      );

      // schedule a debounced state update
      debouncedUpdateIndex(centerIdx);

      // snap into place after the user pauses
      snapTimeout.current = setTimeout(() => {
        listRef.current?.scrollToItem(centerIdx, "center");
      }, 120);
    },
    [width, debouncedUpdateIndex],
  );

  function handleKeyDown(e: React.KeyboardEvent) {
    let newIndex = selectedIndex;
    switch (e.key) {
      case "ArrowLeft":
        newIndex = selectedIndex - 1;
        break;
      case "ArrowRight":
        newIndex = selectedIndex + 1;
        break;
      case "PageUp":
        newIndex = selectedIndex + 10;
        break;
      case "PageDown":
        newIndex = selectedIndex - 10;
        break;
      case "Home":
        newIndex = STEPS_PER_DAY * Math.floor(LOOP / 2);
        break;
      case "End":
        newIndex = STEPS_PER_DAY * Math.floor(LOOP / 2) + STEPS_PER_DAY - 1;
        break;
      default:
        return;
    }
    setSelectedIndex(newIndex);
    listRef.current?.scrollToItem(newIndex, "center");
  }

  function handleOptionClick(offsetMinutes: number) {
    // if clicking the same option → toggle off
    if (selectedOption === offsetMinutes) {
      const base = baseIndexRef.current ?? getNowIndex();
      setSelectedIndex(base);
      setSelectedOption(null);
      baseIndexRef.current = null;
      listRef.current?.scrollToItem(base, "center");
      return;
    }

    // first time selecting any option, capture base
    if (baseIndexRef.current === null) {
      baseIndexRef.current = selectedIndex;
    }

    const base = baseIndexRef.current;
    const offsetSteps = offsetMinutes / STEP;
    const newIndex = base + offsetSteps;

    setSelectedOption(offsetMinutes);
    setSelectedIndex(newIndex);
    listRef.current?.scrollToItem(newIndex, "center");
  }

  const minuteOfDay = (selectedIndex % STEPS_PER_DAY) * STEP;
  const hour = Math.floor(minuteOfDay / 60);
  const minute = minuteOfDay % 60;

  console.log("rendered");
  const TimeDisplay = useMemo(() => {
    return (
      <NumberFlowGroup>
        <div className="flex flex-row items-baseline text-6xl font-bold">
          <NumberFlow
            value={hour}
            trend={+1}
            digits={{ 1: { max: 2 } }}
            format={{ minimumIntegerDigits: 2 }}
            transformTiming={{ duration: 200, easing: "ease-out" }}
            spinTiming={{
              duration: 150,
              easing: "cubic-bezier(0.4, 0, 0.2, 1)",
            }}
            opacityTiming={{ duration: 100, easing: "linear" }}
            className="tabular-nums"
          />
          <NumberFlow
            value={minute}
            prefix=":"
            trend={+1}
            digits={{ 1: { max: 5 } }}
            format={{ minimumIntegerDigits: 2 }}
            transformTiming={{ duration: 200, easing: "ease-out" }}
            spinTiming={{
              duration: 150,
              easing: "cubic-bezier(0.4, 0, 0.2, 1)",
            }}
            opacityTiming={{ duration: 100, easing: "linear" }}
            className="tabular-nums"
          />
        </div>
      </NumberFlowGroup>
    );
  }, [hour, minute]);
  return (
    <div
      tabIndex={0}
      role="slider"
      aria-valuenow={minuteOfDay}
      aria-valuemin={0}
      aria-valuemax={1440 - STEP}
      aria-valuetext={formatTime(selectedIndex)}
      aria-label="Time slider"
      onKeyDown={handleKeyDown}
      className="flex w-full flex-col items-center justify-center gap-6 p-4"
    >
      {TimeDisplay}
      <div ref={containerRef} className="w-full">
        {width !== null && (
          <List
            ref={listRef}
            layout="horizontal"
            height={60}
            width={width}
            itemCount={TOTAL}
            itemSize={ITEM_SIZE}
            onScroll={handleScroll}
            overscanCount={1}
            className="no-scrollbar"
            style={{ scrollBehavior: "smooth" }}
          >
            {({ index, style }) => {
              const stepOfDay = mod(index, STEPS_PER_DAY);
              const currentStepOfDay = mod(selectedIndex, STEPS_PER_DAY);
              const distance = Math.min(
                Math.abs(stepOfDay - currentStepOfDay),
                STEPS_PER_DAY - Math.abs(stepOfDay - currentStepOfDay),
              );

              let heightClass = "h-9";
              let colorClass = "bg-neutral-200";
              if (distance === 0) {
                heightClass = "h-14";
                colorClass = "bg-blue-500";
              } else if (distance === 1) {
                heightClass = "h-11";
              } else if (distance === 2) {
                heightClass = "h-10";
              }

              return (
                <div
                  style={style}
                  className="flex h-12 items-end justify-center"
                  aria-label={formatTime(index)}
                >
                  <div
                    className={`min-h-8 w-4 min-w-4 rounded-md transition-all duration-300 ease-in-out ${heightClass} ${colorClass}`}
                  />
                </div>
              );
            }}
          </List>
        )}
      </div>
      <div className="flex w-full gap-2">
        {TIME_OPTIONS.map((opt) => (
          <Button
            key={opt.value}
            size="lg"
            variant={selectedOption === opt.value ? "default" : "outline"}
            aria-pressed={selectedOption === opt.value}
            onClick={() => handleOptionClick(opt.value)}
            className="px-3"
          >
            {opt.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
