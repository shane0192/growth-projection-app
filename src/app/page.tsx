"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import InputForm from '@/components/InputForm';
import { useProjection } from '@/context/ProjectionContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChartBar, ArrowRight } from 'lucide-react';

export default function Home() {
  const { loadClientList, growthProjections } = useProjection();
  const router = useRouter();

  // Load client list on component mount
  useEffect(() => {
    loadClientList();
  }, [loadClientList]);

  // Navigate to results page if projections exist
  const viewResults = () => {
    if (growthProjections.length > 0) {
      router.push('/results');
    }
  };

  return (
    <main className="min-h-screen flex flex-col">
      <header className="py-8 bg-blue-600">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-white">Growth Projection & Revenue Modeling</h1>
          <p className="mt-2 text-lg text-white/90">Project newsletter subscriber growth and revenue generation</p>
        </div>
      </header>

      <div className="flex-grow container mx-auto py-12 px-4">
        <div className="grid grid-cols-1 gap-10 max-w-3xl mx-auto">
          <div className="text-center mb-4">
            <ChartBar size={48} className="mx-auto mb-4 text-blue-600" />
            <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">Newsletter Growth Calculator</h2>
            <p className="text-lg text-gray-500">Enter your parameters below to generate detailed growth and revenue projections</p>
          </div>
          
          {/* Input Form */}
          <Card>
            <CardHeader>
              <CardTitle>Input Parameters</CardTitle>
              <CardDescription>Enter your growth and revenue assumptions</CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <InputForm />
            </CardContent>
          </Card>
          
          {/* View Results Button */}
          {growthProjections.length > 0 && (
            <div className="text-center py-4">
              <Button 
                onClick={viewResults} 
                size="lg" 
                className="gap-2"
              >
                View Detailed Results
                <ArrowRight size={18} />
              </Button>
            </div>
          )}
        </div>
      </div>

      <footer className="py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-500">&copy; {new Date().getFullYear()} Growth Projection & Revenue Modeling Tool</p>
        </div>
      </footer>
    </main>
  );
}
