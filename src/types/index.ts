// Client data types
export interface ClientData {
  id?: string;
  name: string;
  currentSubscriberCount: number;
  monthlyOrganicGrowth: number;
  organicGrowthRate: number;
  creatorNetworkConversionRate: number;
  creatorNetworkSlots: number;
  creatorNetworkMatchRate: number;
  outOfPocketBudget: number;
  partnerNetworkAllocation: number;
  partnerNetworkCPA: number;
  adsCPA: number;
  paidRecommendations: boolean;
  sponsorships: boolean;
  frontendOffers: boolean;
  paidSubscription: boolean;
  revenueReinvestmentPercentage: number;
  createdAt?: string;
  updatedAt?: string;
}

// Monthly budget allocation
export interface MonthlyBudget {
  month: number;
  partnerNetworkBudget: number;
  adsBudget: number;
}

// Growth projection types
export interface GrowthProjection {
  month: number;
  organicGrowth: number;
  creatorNetworkGrowth: number;
  partnerNetworkGrowth: number;
  adsGrowth: number;
  totalNewSubscribers: number;
  totalSubscribers: number;
}

// Revenue projection types
export interface RevenueProjection {
  month: number;
  paidRecommendationsRevenue: number;
  sponsorshipsRevenue: number;
  frontendOffersRevenue: number;
  paidSubscriptionRevenue: number;
  reinvestedRevenue: number;
  totalRevenue: number;
}

// Complete projection data
export interface ProjectionData {
  id?: string;
  clientId: string;
  clientData: ClientData;
  monthlyBudgets: MonthlyBudget[];
  growthProjections: GrowthProjection[];
  revenueProjections: RevenueProjection[];
  createdAt?: string;
  updatedAt?: string;
  shareableLink?: string;
} 