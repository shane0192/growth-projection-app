import * as z from "zod";

export const clientFormSchema = z.object({
  name: z.string().min(2, {
    message: "Client name must be at least 2 characters.",
  }),
  currentSubscriberCount: z.coerce.number().min(0, {
    message: "Subscriber count must be a positive number.",
  }),
  monthlyOrganicGrowth: z.coerce.number().default(0),
  organicGrowthRate: z.coerce.number().min(0, {
    message: "Growth rate must be a positive number.",
  }),
  creatorNetworkConversionRate: z.coerce.number().min(0).max(100, {
    message: "Conversion rate must be between 0 and 100.",
  }),
  creatorNetworkSlots: z.coerce.number().min(0, {
    message: "Network slots must be a positive number.",
  }),
  creatorNetworkMatchRate: z.coerce.number().min(0).max(100, {
    message: "Match rate must be between 0 and 100.",
  }),
  outOfPocketBudget: z.coerce.number().min(0, {
    message: "Budget must be a positive number.",
  }),
  partnerNetworkAllocation: z.coerce.number().min(0).max(100, {
    message: "Allocation must be between 0 and 100.",
  }),
  partnerNetworkCPA: z.coerce.number().min(0.01, {
    message: "CPA must be at least 0.01.",
  }),
  adsCPA: z.coerce.number().min(0.01, {
    message: "CPA must be at least 0.01.",
  }),
  paidRecommendations: z.boolean().default(false),
  sponsorships: z.boolean().default(false),
  frontendOffers: z.boolean().default(false),
  paidSubscription: z.boolean().default(false),
  revenueReinvestmentPercentage: z.coerce.number().min(0).max(100, {
    message: "Reinvestment percentage must be between 0 and 100.",
  }),
});

export type ClientFormValues = z.infer<typeof clientFormSchema>; 