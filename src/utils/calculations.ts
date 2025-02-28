import { ClientData, GrowthProjection, MonthlyBudget, RevenueProjection } from '@/types';

// Constants for revenue calculations
const PAID_RECOMMENDATION_RATE = 0.05; // 5% of subscribers
const PAID_RECOMMENDATION_VALUE = 10; // $10 per recommendation
const SPONSORSHIP_RATE = 0.02; // 2% of subscribers
const SPONSORSHIP_VALUE = 500; // $500 per sponsorship
const FRONTEND_OFFER_RATE = 0.01; // 1% of subscribers
const FRONTEND_OFFER_VALUE = 50; // $50 per offer
const PAID_SUBSCRIPTION_RATE = 0.03; // 3% of subscribers
const PAID_SUBSCRIPTION_VALUE = 5; // $5 per month

// Calculate growth projections for 12 months
export const calculateGrowthProjections = (
  clientData: ClientData,
  monthlyBudgets: MonthlyBudget[]
): GrowthProjection[] => {
  const projections: GrowthProjection[] = [];
  let totalSubscribers = clientData.currentSubscriberCount;

  for (let month = 1; month <= 12; month++) {
    // Calculate organic growth
    const organicGrowth = Math.round(totalSubscribers * (clientData.organicGrowthRate / 100));

    // Calculate creator network growth
    const creatorNetworkGrowth = Math.round(
      clientData.creatorNetworkSlots * 
      (clientData.creatorNetworkMatchRate / 100) * 
      (clientData.creatorNetworkConversionRate / 100) * 
      totalSubscribers
    );

    // Get monthly budget allocation
    const monthlyBudget = monthlyBudgets.find(b => b.month === month) || {
      month,
      partnerNetworkBudget: (clientData.outOfPocketBudget * (clientData.partnerNetworkAllocation / 100)) / 12,
      adsBudget: (clientData.outOfPocketBudget * (1 - clientData.partnerNetworkAllocation / 100)) / 12
    };

    // Calculate partner network growth
    const partnerNetworkGrowth = Math.round(monthlyBudget.partnerNetworkBudget / clientData.partnerNetworkCPA);

    // Calculate ads growth
    const adsGrowth = Math.round(monthlyBudget.adsBudget / clientData.adsCPA);

    // Calculate total new subscribers for this month
    const totalNewSubscribers = organicGrowth + creatorNetworkGrowth + partnerNetworkGrowth + adsGrowth;
    
    // Update total subscribers
    totalSubscribers += totalNewSubscribers;

    // Add projection for this month
    projections.push({
      month,
      organicGrowth,
      creatorNetworkGrowth,
      partnerNetworkGrowth,
      adsGrowth,
      totalNewSubscribers,
      totalSubscribers
    });
  }

  return projections;
};

// Calculate revenue projections for 12 months
export const calculateRevenueProjections = (
  clientData: ClientData,
  growthProjections: GrowthProjection[]
): RevenueProjection[] => {
  const projections: RevenueProjection[] = [];

  for (let month = 1; month <= 12; month++) {
    const growthData = growthProjections.find(p => p.month === month);
    
    if (!growthData) continue;

    const totalSubscribers = growthData.totalSubscribers;
    
    // Calculate revenue from each stream
    const paidRecommendationsRevenue = clientData.paidRecommendations 
      ? Math.round(totalSubscribers * PAID_RECOMMENDATION_RATE * PAID_RECOMMENDATION_VALUE) 
      : 0;
    
    const sponsorshipsRevenue = clientData.sponsorships 
      ? Math.round(totalSubscribers * SPONSORSHIP_RATE * SPONSORSHIP_VALUE) 
      : 0;
    
    const frontendOffersRevenue = clientData.frontendOffers 
      ? Math.round(totalSubscribers * FRONTEND_OFFER_RATE * FRONTEND_OFFER_VALUE) 
      : 0;
    
    const paidSubscriptionRevenue = clientData.paidSubscription 
      ? Math.round(totalSubscribers * PAID_SUBSCRIPTION_RATE * PAID_SUBSCRIPTION_VALUE) 
      : 0;
    
    // Calculate total revenue
    const totalRevenue = paidRecommendationsRevenue + sponsorshipsRevenue + 
                         frontendOffersRevenue + paidSubscriptionRevenue;
    
    // Calculate reinvested revenue
    const reinvestedRevenue = Math.round(totalRevenue * (clientData.revenueReinvestmentPercentage / 100));
    
    // Add projection for this month
    projections.push({
      month,
      paidRecommendationsRevenue,
      sponsorshipsRevenue,
      frontendOffersRevenue,
      paidSubscriptionRevenue,
      reinvestedRevenue,
      totalRevenue
    });
  }

  return projections;
};

// Generate default monthly budgets
export const generateDefaultMonthlyBudgets = (clientData: ClientData): MonthlyBudget[] => {
  const monthlyBudgets: MonthlyBudget[] = [];
  
  const monthlyPartnerBudget = (clientData.outOfPocketBudget * (clientData.partnerNetworkAllocation / 100)) / 12;
  const monthlyAdsBudget = (clientData.outOfPocketBudget * (1 - clientData.partnerNetworkAllocation / 100)) / 12;
  
  for (let month = 1; month <= 12; month++) {
    monthlyBudgets.push({
      month,
      partnerNetworkBudget: monthlyPartnerBudget,
      adsBudget: monthlyAdsBudget
    });
  }
  
  return monthlyBudgets;
}; 