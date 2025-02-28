import supabase from '@/lib/supabase';

export interface Projection {
  id?: string;
  client_id: string;
  client_data: any;
  monthly_budgets: any;
  growth_projections: any;
  revenue_projections: any;
  created_at?: string;
  updated_at?: string;
}

export const projectionService = {
  // Get all projections
  async getProjections(): Promise<Projection[]> {
    const { data, error } = await supabase
      .from('projections')
      .select('*')
      .order('updated_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching projections:', error);
      throw error;
    }
    
    return data || [];
  },
  
  // Get projections for a specific client
  async getProjectionsByClientId(clientId: string): Promise<Projection[]> {
    const { data, error } = await supabase
      .from('projections')
      .select('*')
      .eq('client_id', clientId)
      .order('updated_at', { ascending: false });
    
    if (error) {
      console.error(`Error fetching projections for client ${clientId}:`, error);
      throw error;
    }
    
    return data || [];
  },
  
  // Get a single projection by ID
  async getProjectionById(id: string): Promise<Projection | null> {
    const { data, error } = await supabase
      .from('projections')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error fetching projection with ID ${id}:`, error);
      throw error;
    }
    
    return data;
  },
  
  // Create a new projection
  async createProjection(projection: Projection): Promise<Projection> {
    const { data, error } = await supabase
      .from('projections')
      .insert([projection])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating projection:', error);
      throw error;
    }
    
    return data;
  },
  
  // Update an existing projection
  async updateProjection(id: string, projection: Partial<Projection>): Promise<Projection> {
    // Add updated_at timestamp
    const updatedProjection = {
      ...projection,
      updated_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('projections')
      .update(updatedProjection)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating projection with ID ${id}:`, error);
      throw error;
    }
    
    return data;
  },
  
  // Delete a projection
  async deleteProjection(id: string): Promise<void> {
    const { error } = await supabase
      .from('projections')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting projection with ID ${id}:`, error);
      throw error;
    }
  }
};

export default projectionService; 