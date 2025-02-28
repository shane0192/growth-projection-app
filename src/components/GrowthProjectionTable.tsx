"use client";

import { useState, useEffect, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { useProjection } from '@/context/ProjectionContext';
import { GrowthProjection } from '@/types';

export default function GrowthProjectionTable() {
  const { growthProjections, setMonthlyBudgets, monthlyBudgets, calculateProjections } = useProjection();
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
      headerName: 'Organic Growth', 
      field: 'organicGrowth',
      editable: false,
      width: 150,
      valueFormatter: (params: any) => params.value.toLocaleString()
    },
    { 
      headerName: 'Creator Network', 
      field: 'creatorNetworkGrowth',
      editable: false,
      width: 150,
      valueFormatter: (params: any) => params.value.toLocaleString()
    },
    { 
      headerName: 'Partner Network', 
      field: 'partnerNetworkGrowth',
      editable: false,
      width: 150,
      valueFormatter: (params: any) => params.value.toLocaleString()
    },
    { 
      headerName: 'Ads Growth', 
      field: 'adsGrowth',
      editable: false,
      width: 150,
      valueFormatter: (params: any) => params.value.toLocaleString()
    },
    { 
      headerName: 'New Subscribers', 
      field: 'totalNewSubscribers',
      editable: false,
      width: 150,
      valueFormatter: (params: any) => params.value.toLocaleString()
    },
    { 
      headerName: 'Total Subscribers', 
      field: 'totalSubscribers',
      editable: false,
      width: 150,
      valueFormatter: (params: any) => params.value.toLocaleString()
    },
    { 
      headerName: 'Partner Budget ($)', 
      field: 'partnerNetworkBudget',
      editable: true,
      width: 150,
      valueFormatter: (params: any) => params.value ? `$${params.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '',
      valueSetter: (params: any) => {
        const month = params.data.month;
        const newValue = parseFloat(params.newValue);
        
        if (isNaN(newValue)) return false;
        
        const updatedBudgets = [...monthlyBudgets];
        const budgetIndex = updatedBudgets.findIndex(b => b.month === month);
        
        if (budgetIndex >= 0) {
          updatedBudgets[budgetIndex] = {
            ...updatedBudgets[budgetIndex],
            partnerNetworkBudget: newValue
          };
        } else {
          updatedBudgets.push({
            month,
            partnerNetworkBudget: newValue,
            adsBudget: 0
          });
        }
        
        setMonthlyBudgets(updatedBudgets);
        return true;
      }
    },
    { 
      headerName: 'Ads Budget ($)', 
      field: 'adsBudget',
      editable: true,
      width: 150,
      valueFormatter: (params: any) => params.value ? `$${params.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '',
      valueSetter: (params: any) => {
        const month = params.data.month;
        const newValue = parseFloat(params.newValue);
        
        if (isNaN(newValue)) return false;
        
        const updatedBudgets = [...monthlyBudgets];
        const budgetIndex = updatedBudgets.findIndex(b => b.month === month);
        
        if (budgetIndex >= 0) {
          updatedBudgets[budgetIndex] = {
            ...updatedBudgets[budgetIndex],
            adsBudget: newValue
          };
        } else {
          updatedBudgets.push({
            month,
            partnerNetworkBudget: 0,
            adsBudget: newValue
          });
        }
        
        setMonthlyBudgets(updatedBudgets);
        return true;
      }
    }
  ], [monthlyBudgets, setMonthlyBudgets]);

  // Prepare row data by combining growth projections with monthly budgets
  const rowData = useMemo(() => {
    return growthProjections.map(projection => {
      const monthBudget = monthlyBudgets.find(b => b.month === projection.month) || {
        partnerNetworkBudget: 0,
        adsBudget: 0
      };
      
      return {
        ...projection,
        partnerNetworkBudget: monthBudget.partnerNetworkBudget,
        adsBudget: monthBudget.adsBudget
      };
    });
  }, [growthProjections, monthlyBudgets]);

  // Handle cell value changes
  const onCellValueChanged = () => {
    calculateProjections();
  };

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
  }, [gridApi, rowData]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Subscriber Growth Projections</h2>
      
      <div className="ag-theme-alpine w-full h-[400px]">
        <AgGridReact
          columnDefs={columnDefs}
          rowData={rowData}
          defaultColDef={defaultColDef}
          onGridReady={onGridReady}
          onCellValueChanged={onCellValueChanged}
          animateRows={true}
          enableCellChangeFlash={true}
        />
      </div>
      
      <div className="mt-4 text-sm text-gray-600">
        <p>* You can adjust Partner Network and Ads Budget values directly in the table to see how they affect growth.</p>
      </div>
    </div>
  );
} 