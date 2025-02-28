import supabase from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export interface ShareableLink {
  id?: string;
  projection_id: string;
  token: string;
  expires_at: string;
  created_at?: string;
}

export const shareService = {
  // Generate a unique token
  generateToken(): string {
    return uuidv4().replace(/-/g, '').substring(0, 16);
  },
  
  // Create a shareable link for a projection
  async createShareableLink(projectionId: string, expiresInDays = 30): Promise<ShareableLink> {
    // Calculate expiration date
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);
    
    const shareableLink: ShareableLink = {
      projection_id: projectionId,
      token: this.generateToken(),
      expires_at: expiresAt.toISOString()
    };
    
    const { data, error } = await supabase
      .from('shareable_links')
      .insert([shareableLink])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating shareable link:', error);
      throw error;
    }
    
    return data;
  },
  
  // Get a shareable link by token
  async getShareableLinkByToken(token: string): Promise<ShareableLink | null> {
    const { data, error } = await supabase
      .from('shareable_links')
      .select('*')
      .eq('token', token)
      .single();
    
    if (error) {
      console.error(`Error fetching shareable link with token ${token}:`, error);
      throw error;
    }
    
    return data;
  },
  
  // Get all shareable links for a projection
  async getShareableLinksByProjectionId(projectionId: string): Promise<ShareableLink[]> {
    const { data, error } = await supabase
      .from('shareable_links')
      .select('*')
      .eq('projection_id', projectionId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error(`Error fetching shareable links for projection ${projectionId}:`, error);
      throw error;
    }
    
    return data || [];
  },
  
  // Delete a shareable link
  async deleteShareableLink(id: string): Promise<void> {
    const { error } = await supabase
      .from('shareable_links')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting shareable link with ID ${id}:`, error);
      throw error;
    }
  },
  
  // Check if a shareable link is valid (not expired)
  isLinkValid(shareableLink: ShareableLink): boolean {
    const expiresAt = new Date(shareableLink.expires_at);
    const now = new Date();
    return expiresAt > now;
  }
};

export default shareService; 