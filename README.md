# Data Arch Website

A modern web application built with Next.js, Prisma ORM, AWS RDS PostgreSQL and AWS S3. This project includes an admin panel, blog management, careers section, contact management, and more.

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the Application](#running-the-application)
- [API Routes Documentation](#api-routes-documentation)
- [Public-Facing URLs](#public-facing-urls)
- [Database Schema](#database-schema)
- [Technologies Used](#technologies-used)

## Features

- **Admin Dashboard**: Manage blogs, job posts, applications, contact submissions and admin account creation
- **Authentication System**: Secure login and user management
- **Blog Management**: Create, edit, and publish blog posts
- **Careers Portal**: Post job openings and handle applications
- **Contact Management**: Process and respond to contact form submissions
- **AWS Integration**: S3 for file storage, RDS for PostgreSQL database
- **Responsive UI**: Modern design with Tailwind CSS and custom components

## Project Structure

```
data-arch-aws/
├── app/ - Next.js application routes and pages
│   ├── admin/ - Admin panel interface
│   ├── api/ - API routes and handlers
│   ├── blogs/ - Public blog pages
│   ├── careers/ - Public careers pages
│   └── services/ - Services information
├── components/ - Reusable UI components
├── hooks/ - Custom React hooks
├── lib/ - Utility functions and libraries
├── prisma/ - Prisma configuration
├── public/ - Static assets
└── styles/ - Global CSS styles
```

## Getting Started

### Prerequisites

- Node.js (v16+)
- NPM package manager
- PostgreSQL database (RDS or local)
- AWS account for S3 bucket access

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/rachitnimje/data-arch-aws.git
   cd data-arch-aws
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up your environment variables:
   ```bash
   cp .env.example .env
   ```

4. Edit `.env` with your  credentials. 

    Note: Prisma fetches the credentials from the `.env` file only, so `.env.local` or `.env.production` won't work for Prisma configuration.

5. Development mode:
   ```bash
   npm run dev
   ```

    Production build:
    ```bash
    npm run build
    npm run start
    ```
    Note: The `package.json` is modified to run `npx prisma generate` in the `npm run build` command. So, step 6 is optional.

5. (Optional) Generate Prisma client:
   ```bash
   npx prisma generate
   ```

### Environment Variables

Create a `.env` file with the following variables:

```
# S3 Bucket Configuration
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=
AWS_BUCKET_NAME=

# JWT Configuration
JWT_SECRET=

# Database Configuration
POSTGRES_HOST=
POSTGRES_PORT=
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_DB=

# Prisma Credentials
DATABASE_URL=postgresql://username:password@host:port/database?schema=public&sslmode=require
DIRECT_URL=postgresql://username:password@host:port/database?schema=public&sslmode=require

# CSRF Credentials
ENCRYPTION_KEY=

# Application
NEXT_PUBLIC_SITE_URL=
```

## API Routes Documentation

| API Route | Method | Access Level | Description |
|-----------|--------|--------------|-------------|
| `/api/applications` | GET | Admin | List all job applications |
| `/api/applications` | POST | Public | Submit a new job application |
| `/api/applications/[id]` | GET | Admin | Get application details |
| `/api/applications/[id]` | PUT | Admin | Update application status |
| `/api/applications/[id]` | DELETE | Admin | Delete an application |
| `/api/auth/change-password` | POST | Admin | Change account password |
| `/api/auth/check` | GET | Any | Check authentication status |
| `/api/auth/csrf` | GET | Any | Get CSRF token for forms |
| `/api/auth/generate-password` | POST | Admin | Generate temporary password |
| `/api/auth/login` | POST | Any | Authenticate and login |
| `/api/auth/logout` | POST | Any | End user session |
| `/api/jobs` | GET | Public | List all published jobs |
| `/api/jobs` | POST | Admin | Create a new job posting |
| `/api/jobs/[id]` | GET | Public | Get job details |
| `/api/jobs/[id]` | PUT | Admin | Update a job posting |
| `/api/jobs/[id]` | DELETE | Admin | Delete a job posting |
| `/api/blogs` | GET | Public | List all published blogs |
| `/api/blogs` | POST | Admin | Create a new blog post |
| `/api/blogs/[id]` | GET | Public | Get blog details |
| `/api/blogs/[id]` | PUT | Admin | Update a blog post |
| `/api/blogs/[id]` | DELETE | Admin | Delete a blog post |
| `/api/contact` | GET | Admin | List all contact submissions |
| `/api/contact` | POST | Public | Submit a contact form |
| `/api/contact/[id]` | GET | Admin | Get contact details |
| `/api/contact/[id]` | PUT | Admin | Update contact status |
| `/api/contact/[id]` | DELETE | Admin | Delete a contact entry |
| `/api/create-account` | POST | Admin | Create a new admin account |
| `/api/dashboard/counts` | GET | Admin | Get stats for dashboard stats |
| `/api/recent-activity` | GET | Admin | Get recent system activity |
| `/api/resume-url` | POST | Public | Generate S3 upload URL for resumes |
| `/api/upload` | POST | Admin | Upload files to S3 storage |

### Access Levels

- **Public**: Accessible to all users
- **Admin**: Requires authentication and admin privileges
- **Any**: Available for both authenticated and unauthenticated users but might return different responses

## Public-Facing URLs

| URL | Description |
|-----|-------------|
| `/` | Homepage  |
| `/about` | About page with company information |
| `/services` | Services offered by the company |
| `/blogs` | Blog listing page |
| `/blogs/[slug]` | Individual blog post page |
| `/careers` | Job listings page |
| `/careers/[id]` | Individual job details page |
| `/careers/[id]/apply` | Job application form page |
| `/careers/application-success` | Application success confirmation page |
| `/admin/login` | Admin login page |

## Database Schema

The database schema is managed through Prisma. 

Check the `prisma/schema.prisma` file for the database configuration.
Check the `database-schema.sql` file for the PostgreSQL database schema.

To apply the database schema to your PostgreSQL instance:

```bash
npx prisma db push
```

You can also create the initial table structure using the `database-schema.sql` file:

```bash
psql -U username -d database_name -f database-schema.sql
```

## Technologies Used

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL on AWS RDS
- **File Storage**: AWS S3
- **Authentication**: Custom JWT-based auth system
