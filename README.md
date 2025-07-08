# Task Manager

A task & habit tracker built with Next.js, Drizzle ORM, and PostgreSQL—fully containerized with Docker.

**Note: Before running the app for the first time, you need to seed the database with a default data.**

## Tech Stack
- Next.js
- Tailwind CSS
- Shadcn UI
- Drizzle ORM
- PostgreSQL
- Docker & Docker Compose
- Adminer

## Prerequisites
- Docker & Docker Compose installed  

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, create your .env file
```dotenv
DATABASE_URL="postgres://postgres:mypassword@localhost:5432/postgres"
```

start containers: 
```bash
docker-compose up -d
```

this will launch:
- **PostgreSQL** on port `5432`
- **Adminer** on port `8080`

then, install dependecies
```bash
npm install
```

run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Database seeding
Before running the app for the first time, you need to seed the database with a default user. I provide a seed script that:
- Create default user and settings.
- Inserts three sample tasks (TASK, HABIT, EVENT) with today’s date as the start_date.

```bash
npm run db:seed
```

After seeding you should see in logs:
```bash
Seed complete!
```

## Database Admin
- Access Adminer at http://localhost:8080
- System: PostgreSQL
- Server: postgres (service name)
- Username: postgres
- Password: mypassword
- Database: postgres

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
