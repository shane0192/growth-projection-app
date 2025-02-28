# Growth Projection & Revenue Modeling App

This application is designed to replace an existing spreadsheet-based system used for projecting newsletter subscriber growth and revenue generation. It provides an intuitive UI/UX with real-time calculations and visual insights while maintaining the flexibility of a spreadsheet.

## Features

- **Client Data Management**: Create, store, and manage multiple client projections
- **Growth Projections**: Calculate subscriber growth based on various channels (organic, creator network, partner network, ads)
- **Revenue Modeling**: Project revenue from multiple streams (paid recommendations, sponsorships, front-end offers, paid subscriptions)
- **Interactive Tables**: Edit projections in real-time with spreadsheet-like functionality
- **Visual Insights**: View growth and revenue trends through interactive charts
- **Shareable Links**: Generate client-facing links for read-only access to projections

## Tech Stack

- **Frontend**: Next.js with TypeScript and Tailwind CSS
- **UI Components**: AG Grid for interactive tables, Recharts for data visualization
- **Backend**: Supabase for serverless database and authentication
- **Deployment**: Vercel (recommended)

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd growth-projection-app
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
   - Create a `.env.local` file in the root directory
   - Add your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   ```

4. Set up Supabase tables:
   - Follow the detailed instructions in the `SUPABASE_SETUP.md` file
   - Alternatively, you can manually create the tables as described below:
     - Create a `clients` table with columns:
       - `id` (uuid, primary key)
       - `name` (text)
       - `created_at` (timestamp with timezone)
     - Create a `projections` table with columns:
       - `id` (uuid, primary key)
       - `client_id` (uuid, foreign key to clients.id)
       - `client_data` (jsonb)
       - `monthly_budgets` (jsonb)
       - `growth_projections` (jsonb)
       - `revenue_projections` (jsonb)
       - `created_at` (timestamp with timezone)
       - `updated_at` (timestamp with timezone)
     - Create a `shareable_links` table with columns:
       - `id` (uuid, primary key)
       - `projection_id` (uuid, foreign key to projections.id)
       - `token` (text, unique)
       - `expires_at` (timestamp with timezone)
       - `created_at` (timestamp with timezone)

5. Run the development server:
```bash
npm run dev
# or
yarn dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

1. **Create a New Projection**:
   - Fill out the client data form with relevant information
   - Click "Calculate Projections" to generate growth and revenue projections

2. **Adjust Projections**:
   - Edit monthly budget allocations directly in the growth projection table
   - See real-time updates to growth and revenue projections

3. **Save and Share**:
   - Projections are automatically saved to the database
   - Generate a shareable link to provide read-only access to clients

## Database Setup

The application uses Supabase as its backend database. We've provided two ways to set up the required database tables:

1. **Using the SQL Editor**: Copy the contents of `supabase-schema.sql` and run it in the Supabase SQL Editor.
2. **Manual Setup**: Follow the instructions in `SUPABASE_SETUP.md` for a step-by-step guide.

For more detailed information about the database schema and setup process, please refer to the `SUPABASE_SETUP.md` file.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
