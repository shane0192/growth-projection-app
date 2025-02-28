# Supabase Setup Instructions

This document provides instructions for setting up the Supabase database for the Growth Projection & Revenue Modeling App.

## Prerequisites

- A Supabase account (sign up at [https://supabase.com](https://supabase.com))
- A Supabase project (create one from the Supabase dashboard)

## Setup Steps

### 1. Get Your Supabase Credentials

1. Log in to the [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to Project Settings (gear icon) > API
4. Copy the following values:
   - **Project URL**: This is your `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public** key: This is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 2. Update Your Environment Variables

1. Create or update the `.env.local` file in your project root with the following:

```
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 3. Create Database Tables

1. Go to the SQL Editor in your Supabase Dashboard
2. Copy the contents of the `supabase-schema.sql` file from this project
3. Paste it into the SQL Editor
4. Click "Run" to execute the SQL and create the tables

The SQL script will:
- Create the necessary tables (`clients`, `projections`, and `shareable_links`)
- Set up indexes for better performance
- Configure Row Level Security (RLS) policies for anonymous access (for demo purposes)

### 4. Verify Setup

To verify that your setup is correct:

1. Go to the "Table Editor" in your Supabase Dashboard
2. You should see the three tables: `clients`, `projections`, and `shareable_links`
3. Start your Next.js application with `npm run dev`
4. Try creating a client and a projection to ensure the database connection is working

## Database Schema

### clients
- `id`: UUID (Primary Key)
- `name`: TEXT
- `created_at`: TIMESTAMPTZ

### projections
- `id`: UUID (Primary Key)
- `client_id`: UUID (Foreign Key to clients.id)
- `client_data`: JSONB
- `monthly_budgets`: JSONB
- `growth_projections`: JSONB
- `revenue_projections`: JSONB
- `created_at`: TIMESTAMPTZ
- `updated_at`: TIMESTAMPTZ

### shareable_links
- `id`: UUID (Primary Key)
- `projection_id`: UUID (Foreign Key to projections.id)
- `token`: TEXT (Unique)
- `expires_at`: TIMESTAMPTZ
- `created_at`: TIMESTAMPTZ

## Security Considerations

For this demo application, we've set up RLS policies to allow anonymous access to all tables. In a production environment, you should:

1. Implement proper authentication
2. Update RLS policies to restrict access based on user authentication
3. Consider adding additional security measures like API rate limiting

## Troubleshooting

If you encounter issues:

1. Verify your Supabase credentials are correct in `.env.local`
2. Check that all tables were created successfully
3. Ensure your Supabase project has the correct region and settings
4. Check the browser console for any connection errors 