"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import supabase from '@/lib/supabase';
import { ProjectionData } from '@/types';
import GrowthProjectionTable from '@/components/GrowthProjectionTable';
import RevenueProjectionTable from '@/components/RevenueProjectionTable';
import ProjectionCharts from '@/components/ProjectionCharts';
import { ProjectionProvider } from '@/context/ProjectionContext';

export default function SharePage() {
  const params = useParams();
  const token = params.token as string;
  const [projectionData, setProjectionData] = useState<ProjectionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSharedProjection = async () => {
      try {
        // Fetch the shareable link data
        const { data: linkData, error: linkError } = await supabase
          .from('shareable_links')
          .select('projection_id, expires_at')
          .eq('token', token)
          .single();

        if (linkError || !linkData) {
          setError('Invalid or expired link');
          setLoading(false);
          return;
        }

        // Check if the link has expired
        if (new Date(linkData.expires_at) < new Date()) {
          setError('This link has expired');
          setLoading(false);
          return;
        }

        // Fetch the projection data
        const { data: projectionData, error: projectionError } = await supabase
          .from('projections')
          .select('*')
          .eq('id', linkData.projection_id)
          .single();

        if (projectionError || !projectionData) {
          setError('Projection not found');
          setLoading(false);
          return;
        }

        setProjectionData(projectionData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching shared projection:', error);
        setError('An error occurred while loading the projection');
        setLoading(false);
      }
    };

    fetchSharedProjection();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading projection data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
          <svg
            className="w-16 h-16 text-red-500 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h2 className="text-2xl font-bold mb-4">Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!projectionData) {
    return null;
  }

  // Create a custom provider with the shared projection data
  const SharedProjectionProvider = ({ children }: { children: React.ReactNode }) => {
    return (
      <ProjectionProvider>
        {children}
      </ProjectionProvider>
    );
  };

  return (
    <SharedProjectionProvider>
      <main className="min-h-screen bg-gray-100">
        <header className="bg-blue-700 text-white p-4 shadow-md">
          <div className="container mx-auto">
            <h1 className="text-3xl font-bold">Growth Projection & Revenue Modeling</h1>
            <p className="text-blue-100">
              Shared projection for {projectionData.clientData.name}
            </p>
          </div>
        </header>

        <div className="container mx-auto py-8 px-4">
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-bold mb-4">Client Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">Client Name</p>
                <p className="text-lg font-medium">{projectionData.clientData.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Current Subscribers</p>
                <p className="text-lg font-medium">
                  {projectionData.clientData.currentSubscriberCount.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Organic Growth Rate</p>
                <p className="text-lg font-medium">{projectionData.clientData.organicGrowthRate}%</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8">
            <GrowthProjectionTable />
            <RevenueProjectionTable />
            <ProjectionCharts />
          </div>
        </div>

        <footer className="bg-gray-800 text-white p-4 mt-12">
          <div className="container mx-auto text-center">
            <p>&copy; {new Date().getFullYear()} Growth Projection & Revenue Modeling Tool</p>
          </div>
        </footer>
      </main>
    </SharedProjectionProvider>
  );
} 