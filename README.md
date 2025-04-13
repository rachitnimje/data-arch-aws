# Data Architecture Project - Database Migration

This project has been migrated from Supabase to AWS RDS PostgreSQL using Prisma as the ORM.

## Migration Steps

1. Install the required dependencies:
   \`\`\`bash
   npm install @prisma/client pg
   npm install -D prisma
   \`\`\`

2. Initialize Prisma:
   \`\`\`bash
   npx prisma init
   \`\`\`

3. Update the `.env` file with your PostgreSQL connection details:
   \`\`\`
   DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}?schema=public&sslmode=require
   DIRECT_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}?schema=public&sslmode=require
   \`\`\`

4. Generate the Prisma client:
   \`\`\`bash
   npx prisma generate
   \`\`\`

5. Create the database schema:
   \`\`\`bash
   npx prisma db push
   \`\`\`

6. Run the data migration script:
   \`\`\`bash
   npm install dotenv @supabase/supabase-js
   npx ts-node scripts/migrate-data.ts
   \`\`\`

## SSL Configuration

The connection to AWS RDS PostgreSQL is configured to use SSL by default. This is specified in the connection string with `sslmode=require`.

## Project Structure

- `prisma/schema.prisma`: Defines the database schema
- `lib/prisma.ts`: Exports the Prisma client instance
- `scripts/migrate-data.ts`: Script to migrate data from Supabase to PostgreSQL

## API Routes

All API routes have been updated to use Prisma instead of Supabase. The functionality remains the same, but the underlying database access has changed.

## Environment Variables

Make sure the following environment variables are set:

\`\`\`
# PostgreSQL Connection
POSTGRES_HOST=your-rds-host.region.rds.amazonaws.com
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your-password
POSTGRES_DB=postgres

# For Prisma
DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}?schema=public&sslmode=require
DIRECT_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}?schema=public&sslmode=require
