# Finance Data Processing and Access Control Backend

## Overview
This is a backend system built thoughtfully to handle user management, financial records processing, and dashboard analytics. It implements a robust Role-Based Access Control (RBAC) system using JSON Web Tokens (JWT).

## Features
- **Authentication & Authorization**: JWT-based login and role guard middlewares.
- **Role Management**: Three distinct user roles (`ADMIN`, `ANALYST`, `VIEWER`).
- **Financial Records CRUD**: Full lifecycle management of financial records.
- **Analytics Dashboard**: Aggregated insights and summary metrics.
- **Validation**: Input payload, query, and param validation using **Zod**.
- **Data Persistence**: Uses **SQLite** with **Prisma ORM** for simplicity and structured modeling.
- **Error Handling**: Standardized error responses and Zod schema error formatting.

## Assumption & Tradeoffs
1. **SQLite**: Chosen for its zero-configuration simplicity per the assignment guidelines. In a real-world high-concurrency app, this would be swapped to PostgreSQL.
2. **First User Role**: Currently, registered users default to the `VIEWER` role. An existing `ADMIN` must upgrade their access. You can manually tweak the database to create the first `ADMIN`.
3. **Database URL format**: Built with Prisma 7 configuration defaults, bypassing schema-level datasource hardcoding.

## Prerequisites
- Node.js (v18+)

## Setup Instructions

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Generate Prisma Client and Push DB Schema**
   ```bash
   npx prisma db push
   npx prisma generate
   ```

3. **Environment Setup**
   A `.env` file should be present with the following:
   ```env
   DATABASE_URL="file:./dev.db"
   JWT_SECRET="supersecretjwtkey_for_development"
   PORT=3000
   ```

4. **Run the server**
   ```bash
   npx ts-node-dev src/index.ts
   ```

## Roles

- **VIEWER**: Can only hit `GET /api/dashboard/summary`.
- **ANALYST**: Can view records and dashboard insights.
- **ADMIN**: Has full CRUD permissions on records and users.

## Testing Endpoints
Use tools like Postman or Insomnia.
1. `POST /api/auth/register` (creates a user)
2. `POST /api/auth/login` (returns a JWT token)
3. Use the token in headers: `Authorization: Bearer <token>`
4. Access `GET /api/records` or `GET /api/dashboard/summary`.
