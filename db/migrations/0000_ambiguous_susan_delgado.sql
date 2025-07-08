CREATE TYPE "public"."weekday" AS ENUM('MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN');--> statement-breakpoint
CREATE TABLE "habit_days" (
	"habit_id" integer NOT NULL,
	"weekday" "weekday" NOT NULL,
	CONSTRAINT "habit_days_habit_id_weekday_pk" PRIMARY KEY("habit_id","weekday")
);
--> statement-breakpoint
CREATE TABLE "habits" (
	"task_id" integer PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE "holidays" (
	"id" serial PRIMARY KEY NOT NULL,
	"country" varchar(2) NOT NULL,
	"region" varchar(10),
	"name" varchar(255) NOT NULL,
	"date" date NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "tasks" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"type" "task_type" NOT NULL,
	"completed" boolean DEFAULT false NOT NULL,
	"start_date" date NOT NULL,
	"start_time" time,
	"end_date" date,
	"end_time" time,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"wake_up_time" time DEFAULT '07:00' NOT NULL,
	"sleep_time" time DEFAULT '23:00' NOT NULL,
	"show_wake_up" boolean DEFAULT true NOT NULL,
	"show_sleep" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "habit_days" ADD CONSTRAINT "habit_days_habit_id_habits_task_id_fk" FOREIGN KEY ("habit_id") REFERENCES "public"."habits"("task_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "habits" ADD CONSTRAINT "habits_task_id_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."tasks"("id") ON DELETE cascade ON UPDATE no action;