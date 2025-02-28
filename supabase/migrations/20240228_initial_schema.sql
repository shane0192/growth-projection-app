-- Create clients table
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create projections table
CREATE TABLE IF NOT EXISTS projections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id),
  client_data JSONB NOT NULL,
  monthly_budgets JSONB NOT NULL,
  growth_projections JSONB NOT NULL,
  revenue_projections JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create shareable_links table
CREATE TABLE IF NOT EXISTS shareable_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  projection_id UUID REFERENCES projections(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_clients_name ON clients(name);
CREATE INDEX IF NOT EXISTS idx_projections_client_id ON projections(client_id);
CREATE INDEX IF NOT EXISTS idx_shareable_links_token ON shareable_links(token);
CREATE INDEX IF NOT EXISTS idx_shareable_links_projection_id ON shareable_links(projection_id);

-- Create RLS policies
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE projections ENABLE ROW LEVEL SECURITY;
ALTER TABLE shareable_links ENABLE ROW LEVEL SECURITY;

-- Create policies for anonymous access (for demo purposes)
-- In a production environment, you would want to restrict access based on user authentication
CREATE POLICY "Allow anonymous select on clients" ON clients FOR SELECT USING (true);
CREATE POLICY "Allow anonymous insert on clients" ON clients FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous update on clients" ON clients FOR UPDATE USING (true);

CREATE POLICY "Allow anonymous select on projections" ON projections FOR SELECT USING (true);
CREATE POLICY "Allow anonymous insert on projections" ON projections FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous update on projections" ON projections FOR UPDATE USING (true);

CREATE POLICY "Allow anonymous select on shareable_links" ON shareable_links FOR SELECT USING (true);
CREATE POLICY "Allow anonymous insert on shareable_links" ON shareable_links FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous update on shareable_links" ON shareable_links FOR UPDATE USING (true); 