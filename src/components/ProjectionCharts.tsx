import { useMemo } from 'react';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { useProjection } from '@/context/ProjectionContext';

export default function ProjectionCharts() {
  const { growthProjections, revenueProjections } = useProjection();

  // Prepare data for growth chart
  const growthChartData = useMemo(() => {
    return growthProjections.map(projection => {
      const date = new Date();
      date.setMonth(date.getMonth() + projection.month - 1);
      const monthLabel = date.toLocaleString('default', { month: 'short', year: 'numeric' });
      
      return {
        name: monthLabel,
        Organic: projection.organicGrowth,
        Creator: projection.creatorNetworkGrowth,
        Partner: projection.partnerNetworkGrowth,
        Ads: projection.adsGrowth,
        Total: projection.totalSubscribers
      };
    });
  }, [growthProjections]);

  // Prepare data for revenue chart
  const revenueChartData = useMemo(() => {
    return revenueProjections.map(projection => {
      const date = new Date();
      date.setMonth(date.getMonth() + projection.month - 1);
      const monthLabel = date.toLocaleString('default', { month: 'short', year: 'numeric' });
      
      return {
        name: monthLabel,
        'Paid Recommendations': projection.paidRecommendationsRevenue,
        'Sponsorships': projection.sponsorshipsRevenue,
        'Front-end Offers': projection.frontendOffersRevenue,
        'Paid Subscriptions': projection.paidSubscriptionRevenue,
        'Total': projection.totalRevenue
      };
    });
  }, [revenueProjections]);

  // Format currency for tooltip
  const formatCurrency = (value: number) => {
    return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Format number for tooltip
  const formatNumber = (value: number) => {
    return value.toLocaleString();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Projection Charts</h2>
      
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Subscriber Growth Over Time</h3>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={growthChartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={formatNumber} />
              <Legend />
              <Line type="monotone" dataKey="Total" stroke="#8884d8" strokeWidth={2} />
              <Line type="monotone" dataKey="Organic" stroke="#82ca9d" />
              <Line type="monotone" dataKey="Creator" stroke="#ffc658" />
              <Line type="monotone" dataKey="Partner" stroke="#ff8042" />
              <Line type="monotone" dataKey="Ads" stroke="#0088fe" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4">Revenue by Month</h3>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={revenueChartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => `$${value}`} />
              <Tooltip formatter={formatCurrency} />
              <Legend />
              <Bar dataKey="Paid Recommendations" stackId="a" fill="#8884d8" />
              <Bar dataKey="Sponsorships" stackId="a" fill="#82ca9d" />
              <Bar dataKey="Front-end Offers" stackId="a" fill="#ffc658" />
              <Bar dataKey="Paid Subscriptions" stackId="a" fill="#ff8042" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
} 