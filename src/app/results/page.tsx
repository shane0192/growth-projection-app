"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import GrowthProjectionTable from '@/components/GrowthProjectionTable';
import RevenueProjectionTable from '@/components/RevenueProjectionTable';
import ProjectionCharts from '@/components/ProjectionCharts';
import ShareProjection from '@/components/ShareProjection';
import { useProjection } from '@/context/ProjectionContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Share2, LineChart, BarChart3, DollarSign } from 'lucide-react';

export default function ResultsPage() {
  const { growthProjections } = useProjection();
  const router = useRouter();

  // Redirect to home if no projections exist
  useEffect(() => {
    if (growthProjections.length === 0) {
      router.push('/');
    }
  }, [growthProjections, router]);

  return (
    <main className="min-h-screen flex flex-col">
      <header className="py-8 bg-blue-600">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-white">Growth Projection Results</h1>
          <p className="mt-2 text-lg text-white/90">Detailed analysis of your growth and revenue projections</p>
        </div>
      </header>

      <div className="flex-grow container mx-auto py-12 px-4">
        <div className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <Button 
            onClick={() => router.push('/')} 
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Back to Form
          </Button>
          
          <div className="flex items-center gap-2 p-2">
            <Share2 size={18} className="text-blue-600" />
            <span className="font-medium text-sm">Share Results:</span>
            <ShareProjection />
          </div>
        </div>

        {growthProjections.length > 0 ? (
          <Tabs defaultValue="growth" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="growth" className="flex gap-2">
                <BarChart3 size={18} />
                <span>Growth</span>
              </TabsTrigger>
              <TabsTrigger value="revenue" className="flex gap-2">
                <DollarSign size={18} />
                <span>Revenue</span>
              </TabsTrigger>
              <TabsTrigger value="charts" className="flex gap-2">
                <LineChart size={18} />
                <span>Charts</span>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="growth">
              <Card>
                <CardHeader>
                  <CardTitle>Growth Projections</CardTitle>
                  <CardDescription>Monthly subscriber growth based on your inputs</CardDescription>
                </CardHeader>
                <CardContent>
                  <GrowthProjectionTable />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="revenue">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Projections</CardTitle>
                  <CardDescription>Monthly revenue based on your growth projections</CardDescription>
                </CardHeader>
                <CardContent>
                  <RevenueProjectionTable />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="charts">
              <Card>
                <CardHeader>
                  <CardTitle>Projection Charts</CardTitle>
                  <CardDescription>Visual representation of your projections</CardDescription>
                </CardHeader>
                <CardContent>
                  <ProjectionCharts />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>No Projections Available</CardTitle>
              <CardDescription>Please go back and fill out the form</CardDescription>
            </CardHeader>
            <CardContent className="text-center pt-6 pb-6">
              <p className="mb-8 text-gray-500 text-lg">
                No projection data is available. Please return to the form page and submit your parameters.
              </p>
              <Button 
                onClick={() => router.push('/')} 
              >
                Go to Form
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <footer className="py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-500">&copy; {new Date().getFullYear()} Growth Projection & Revenue Modeling Tool</p>
        </div>
      </footer>
    </main>
  );
} 