"use client";

import { createContext, useContext, useState, ReactNode } from 'react';
import { ClientData, GrowthProjection, MonthlyBudget, ProjectionData, RevenueProjection } from '@/types';
import { calculateGrowthProjections, calculateRevenueProjections, generateDefaultMonthlyBudgets } from '@/utils/calculations';
import supabase from '@/lib/supabase';

// Default client data values
const defaultClientData: ClientData = {
  name: '',
  currentSubscriberCount: 1000,
  monthlyOrganicGrowth: 40,
  organicGrowthRate: 4,
  creatorNetworkConversionRate: 28,
  creatorNetworkSlots: 4,
  creatorNetworkMatchRate: 65,
  outOfPocketBudget: 5000,
  partnerNetworkAllocation: 30,
  partnerNetworkCPA: 2,
  adsCPA: 1.5,
  paidRecommendations: true,
  sponsorships: true,
  frontendOffers: true,
  paidSubscription: false,
  revenueReinvestmentPercentage: 20,
};

interface ProjectionContextType {
  clientData: ClientData;
  setClientData: (data: ClientData) => void;
  monthlyBudgets: MonthlyBudget[];
  setMonthlyBudgets: (budgets: MonthlyBudget[]) => void;
  growthProjections: GrowthProjection[];
  revenueProjections: RevenueProjection[];
  calculateProjections: () => void;
  saveProjection: () => Promise<string | null>;
  loadProjection: (id: string) => Promise<boolean>;
  clientList: { id: string; name: string }[];
  loadClientList: () => Promise<void>;
  currentProjectionId: string | null;
  generateShareableLink: (projectionId: string) => Promise<string | null>;
  resetToDefaults: () => void;
}

const ProjectionContext = createContext<ProjectionContextType | undefined>(undefined);

export const ProjectionProvider = ({ children }: { children: ReactNode }) => {
  const [clientData, setClientData] = useState<ClientData>(defaultClientData);
  const [monthlyBudgets, setMonthlyBudgets] = useState<MonthlyBudget[]>(
    generateDefaultMonthlyBudgets(defaultClientData)
  );
  const [growthProjections, setGrowthProjections] = useState<GrowthProjection[]>([]);
  const [revenueProjections, setRevenueProjections] = useState<RevenueProjection[]>([]);
  const [clientList, setClientList] = useState<{ id: string; name: string }[]>([]);
  const [currentProjectionId, setCurrentProjectionId] = useState<string | null>(null);

  // Calculate projections based on current data
  const calculateProjections = () => {
    const growth = calculateGrowthProjections(clientData, monthlyBudgets);
    const revenue = calculateRevenueProjections(clientData, growth);
    
    setGrowthProjections(growth);
    setRevenueProjections(revenue);
  };

  // Save projection to database
  const saveProjection = async (): Promise<string | null> => {
    try {
      const projectionData: ProjectionData = {
        clientId: clientData.id || '',
        clientData,
        monthlyBudgets,
        growthProjections,
        revenueProjections,
      };

      let result;

      if (currentProjectionId) {
        // Update existing projection
        result = await supabase
          .from('projections')
          .update(projectionData)
          .eq('id', currentProjectionId)
          .select();
      } else {
        // Create new projection
        result = await supabase
          .from('projections')
          .insert(projectionData)
          .select();
      }

      if (result.error) {
        console.error('Error saving projection:', result.error);
        return null;
      }

      // Save or update client data
      if (!clientData.id) {
        const clientResult = await supabase
          .from('clients')
          .insert({ name: clientData.name })
          .select();

        if (clientResult.data && clientResult.data[0]) {
          setClientData({ ...clientData, id: clientResult.data[0].id });
        }
      }

      setCurrentProjectionId(result.data[0].id);
      await loadClientList();
      return result.data[0].id;
    } catch (error) {
      console.error('Error saving projection:', error);
      return null;
    }
  };

  // Load projection from database
  const loadProjection = async (id: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('projections')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        console.error('Error loading projection:', error);
        return false;
      }

      setClientData(data.clientData);
      setMonthlyBudgets(data.monthlyBudgets);
      setGrowthProjections(data.growthProjections);
      setRevenueProjections(data.revenueProjections);
      setCurrentProjectionId(data.id);
      return true;
    } catch (error) {
      console.error('Error loading projection:', error);
      return false;
    }
  };

  // Load client list from database
  const loadClientList = async (): Promise<void> => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('id, name')
        .order('name');

      if (error) {
        console.error('Error loading client list:', error);
        return;
      }

      setClientList(data || []);
    } catch (error) {
      console.error('Error loading client list:', error);
    }
  };

  // Generate shareable link for a projection
  const generateShareableLink = async (projectionId: string): Promise<string | null> => {
    try {
      // Generate a unique token
      const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      
      // Save the token to the database
      const { error } = await supabase
        .from('shareable_links')
        .insert({
          projection_id: projectionId,
          token,
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days expiry
        });

      if (error) {
        console.error('Error generating shareable link:', error);
        return null;
      }

      // Return the shareable link
      return `${window.location.origin}/share/${token}`;
    } catch (error) {
      console.error('Error generating shareable link:', error);
      return null;
    }
  };

  // Reset to default values
  const resetToDefaults = () => {
    setClientData(defaultClientData);
    setMonthlyBudgets(generateDefaultMonthlyBudgets(defaultClientData));
    setGrowthProjections([]);
    setRevenueProjections([]);
    setCurrentProjectionId(null);
  };

  return (
    <ProjectionContext.Provider
      value={{
        clientData,
        setClientData,
        monthlyBudgets,
        setMonthlyBudgets,
        growthProjections,
        revenueProjections,
        calculateProjections,
        saveProjection,
        loadProjection,
        clientList,
        loadClientList,
        currentProjectionId,
        generateShareableLink,
        resetToDefaults,
      }}
    >
      {children}
    </ProjectionContext.Provider>
  );
};

export const useProjection = () => {
  const context = useContext(ProjectionContext);
  if (context === undefined) {
    throw new Error('useProjection must be used within a ProjectionProvider');
  }
  return context;
}; 