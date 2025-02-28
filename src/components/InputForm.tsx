"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useProjection } from '@/context/ProjectionContext';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { clientFormSchema, ClientFormValues } from "@/lib/schemas";

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent } from '@/components/ui/card';

export default function InputForm() {
  const { 
    clientData, 
    setClientData, 
    calculateProjections,
    saveProjection,
    clientList,
    loadProjection,
    resetToDefaults
  } = useProjection();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const router = useRouter();

  // Initialize form with React Hook Form
  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      name: clientData.name,
      currentSubscriberCount: clientData.currentSubscriberCount,
      monthlyOrganicGrowth: clientData.monthlyOrganicGrowth,
      organicGrowthRate: clientData.organicGrowthRate,
      creatorNetworkConversionRate: clientData.creatorNetworkConversionRate,
      creatorNetworkSlots: clientData.creatorNetworkSlots,
      creatorNetworkMatchRate: clientData.creatorNetworkMatchRate,
      outOfPocketBudget: clientData.outOfPocketBudget,
      partnerNetworkAllocation: clientData.partnerNetworkAllocation,
      partnerNetworkCPA: clientData.partnerNetworkCPA,
      adsCPA: clientData.adsCPA,
      paidRecommendations: clientData.paidRecommendations,
      sponsorships: clientData.sponsorships,
      frontendOffers: clientData.frontendOffers,
      paidSubscription: clientData.paidSubscription,
      revenueReinvestmentPercentage: clientData.revenueReinvestmentPercentage,
    },
  });

  // Update form values when clientData changes
  useEffect(() => {
    form.reset({
      name: clientData.name,
      currentSubscriberCount: clientData.currentSubscriberCount,
      monthlyOrganicGrowth: clientData.monthlyOrganicGrowth,
      organicGrowthRate: clientData.organicGrowthRate,
      creatorNetworkConversionRate: clientData.creatorNetworkConversionRate,
      creatorNetworkSlots: clientData.creatorNetworkSlots,
      creatorNetworkMatchRate: clientData.creatorNetworkMatchRate,
      outOfPocketBudget: clientData.outOfPocketBudget,
      partnerNetworkAllocation: clientData.partnerNetworkAllocation,
      partnerNetworkCPA: clientData.partnerNetworkCPA,
      adsCPA: clientData.adsCPA,
      paidRecommendations: clientData.paidRecommendations,
      sponsorships: clientData.sponsorships,
      frontendOffers: clientData.frontendOffers,
      paidSubscription: clientData.paidSubscription,
      revenueReinvestmentPercentage: clientData.revenueReinvestmentPercentage,
    });
  }, [clientData, form]);

  // Handle client selection
  const handleClientSelect = (value: string) => {
    setSelectedClientId(value);
    if (value) {
      loadProjection(value);
    }
  };

  // Handle form submission
  const onSubmit = async (data: ClientFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Update client data in context
      setClientData(data);
      
      // Calculate projections
      calculateProjections();
      
      // Save to database
      await saveProjection();
      
      // Navigate to results page
      router.push('/results');
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Client Selection */}
      <div className="space-y-3">
        <label className="text-sm font-medium">Select Existing Client</label>
        <div className="flex gap-2">
          <Select value={selectedClientId} onValueChange={handleClientSelect}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="-- Select a client --" />
            </SelectTrigger>
            <SelectContent>
              {clientList.map((client) => (
                <SelectItem key={client.id} value={client.id}>
                  {client.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button 
            type="button" 
            onClick={resetToDefaults}
            variant="outline"
          >
            New Client
          </Button>
        </div>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Client Data */}
          <Card className="shadow-sm">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <h3 className="form-section-title">Client Data</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Client Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="currentSubscriberCount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Subscriber Count</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="organicGrowthRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Organic Growth Rate (%)</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" step="0.1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Growth Channels */}
          <Card className="shadow-sm">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <h3 className="form-section-title">Growth Channels</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="creatorNetworkConversionRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Creator Network Conversion Rate (%)</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" max="100" step="0.1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="creatorNetworkSlots"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Creator Network Slots</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="creatorNetworkMatchRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Creator Network Match Rate (%)</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" max="100" step="0.1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Budgeting */}
          <Card className="shadow-sm">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <h3 className="form-section-title">Budgeting</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="outOfPocketBudget"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Out-of-Pocket Growth Budget ($)</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" step="100" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="partnerNetworkAllocation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>% Allocated to Partner Network</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" max="100" step="1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="partnerNetworkCPA"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CPA for Partner Network ($)</FormLabel>
                        <FormControl>
                          <Input type="number" min="0.01" step="0.01" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="adsCPA"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CPA for Ads ($)</FormLabel>
                        <FormControl>
                          <Input type="number" min="0.01" step="0.01" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Revenue Options */}
          <Card className="shadow-sm">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <h3 className="form-section-title">Revenue Options</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="paidRecommendations"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between p-4 rounded-lg bg-gray-50">
                        <div className="space-y-0.5">
                          <FormLabel>Paid Recommendations</FormLabel>
                          <FormDescription>
                            Enable paid recommendations
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="sponsorships"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between p-4 rounded-lg bg-gray-50">
                        <div className="space-y-0.5">
                          <FormLabel>Sponsorships</FormLabel>
                          <FormDescription>
                            Enable sponsorships
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="frontendOffers"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between p-4 rounded-lg bg-gray-50">
                        <div className="space-y-0.5">
                          <FormLabel>Frontend Offers</FormLabel>
                          <FormDescription>
                            Enable frontend offers
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="paidSubscription"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between p-4 rounded-lg bg-gray-50">
                        <div className="space-y-0.5">
                          <FormLabel>Paid Subscription</FormLabel>
                          <FormDescription>
                            Enable paid subscription
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="revenueReinvestmentPercentage"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Revenue Reinvestment Percentage (%)</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" max="100" step="1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <Button 
            type="submit" 
            size="lg"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Calculating...' : 'Calculate Projections'}
          </Button>
        </form>
      </Form>
    </div>
  );
} 