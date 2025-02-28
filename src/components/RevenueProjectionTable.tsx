"use client";

import { useState, useEffect, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { useProjection } from '@/context/ProjectionContext';

export default function RevenueProjectionTable() {
  const { revenueProjections } = useProjection();
  const [gridApi, setGridApi] = useState<any>(null);

  // Define column definitions for AG Grid
  const columnDefs = useMemo(() => [
    { 
      headerName: 'Month', 
      field: 'month',
      editable: false,
      width: 100,
      valueFormatter: (params: any) => {
        const date = new Date();
        date.setMonth(date.getMonth() + params.value - 1);
        return date.toLocaleString('default', { month: 'short', year: 'numeric' });
      }
    },
    { 
      headerName: 'Paid Recommendations', 
      field: 'paidRecommendationsRevenue',
      editable: false,
      width: 180,
      valueFormatter: (params: any) => `$${params.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    },
    { 
      headerName: 'Sponsorships', 
      field: 'sponsorshipsRevenue',
      editable: false,
      width: 150,
      valueFormatter: (params: any) => `$${params.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    },
    { 
      headerName: 'Front-end Offers', 
      field: 'frontendOffersRevenue',
      editable: false,
      width: 150,
      valueFormatter: (params: any) => `$${params.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    },
    { 
      headerName: 'Paid Subscriptions', 
      field: 'paidSubscriptionRevenue',
      editable: false,
      width: 150,
      valueFormatter: (params: any) => `$${params.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    },
    { 
      headerName: 'Reinvested Revenue', 
      field: 'reinvestedRevenue',
      editable: false,
      width: 150,
      valueFormatter: (params: any) => `$${params.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    },
    { 
      headerName: 'Total Revenue', 
      field: 'totalRevenue',
      editable: false,
      width: 150,
      valueFormatter: (params: any) => `$${params.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    }
  ], []);

  // Default column definitions
  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
    resizable: true,
  }), []);

  // Set up grid when it's ready
  const onGridReady = (params: any) => {
    setGridApi(params.api);
  };

  // Auto-size columns when data changes
  useEffect(() => {
    if (gridApi) {
      gridApi.sizeColumnsToFit();
    }
  }, [gridApi, revenueProjections]);

  // Calculate totals for the summary
  const totals = useMemo(() => {
    if (!revenueProjections.length) return null;
    
    return revenueProjections.reduce((acc, curr) => {
      return {
        paidRecommendationsRevenue: acc.paidRecommendationsRevenue + curr.paidRecommendationsRevenue,
        sponsorshipsRevenue: acc.sponsorshipsRevenue + curr.sponsorshipsRevenue,
        frontendOffersRevenue: acc.frontendOffersRevenue + curr.frontendOffersRevenue,
        paidSubscriptionRevenue: acc.paidSubscriptionRevenue + curr.paidSubscriptionRevenue,
        reinvestedRevenue: acc.reinvestedRevenue + curr.reinvestedRevenue,
        totalRevenue: acc.totalRevenue + curr.totalRevenue
      };
    }, {
      paidRecommendationsRevenue: 0,
      sponsorshipsRevenue: 0,
      frontendOffersRevenue: 0,
      paidSubscriptionRevenue: 0,
      reinvestedRevenue: 0,
      totalRevenue: 0
    });
  }, [revenueProjections]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Revenue Projections</h2>
      
      <div className="ag-theme-alpine w-full h-[400px]">
        <AgGridReact
          columnDefs={columnDefs}
          rowData={revenueProjections}
          defaultColDef={defaultColDef}
          onGridReady={onGridReady}
          animateRows={true}
        />
      </div>
      
      {totals && (
        <div className="mt-6 p-4 bg-gray-50 rounded-md">
          <h3 className="text-lg font-semibold mb-3">12-Month Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Total Paid Recommendations</p>
              <p className="text-lg font-medium">${totals.paidRecommendationsRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Sponsorships</p>
              <p className="text-lg font-medium">${totals.sponsorshipsRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Front-end Offers</p>
              <p className="text-lg font-medium">${totals.frontendOffersRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Paid Subscriptions</p>
              <p className="text-lg font-medium">${totals.paidSubscriptionRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Reinvested Revenue</p>
              <p className="text-lg font-medium">${totals.reinvestedRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Revenue (12 Months)</p>
              <p className="text-lg font-medium text-green-600">${totals.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 