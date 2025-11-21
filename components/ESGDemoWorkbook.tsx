"use client";

import React, { useState } from 'react';
import { esgDemoData, ESGDemoData, ESGDemoSheet } from '../types/esg-demo';
import { FinancedEmissionsSheet } from './FinancedEmissionsSheet';
import { DataQualitySheet } from './DataQualitySheet';
import '../styles/esg-excel-theme.css';

interface ESGDemoWorkbookProps {
  data?: ESGDemoData;
  className?: string;
}

export const ESGDemoWorkbook: React.FC<ESGDemoWorkbookProps> = ({ 
  data = esgDemoData,
  className = ''
}) => {
  const [activeSheet, setActiveSheet] = useState(data.activeSheet);
  const [isLoading, setIsLoading] = useState(false);

  const currentSheet = data.sheets.find(sheet => sheet.id === activeSheet);

  const handleSheetChange = async (sheetId: string) => {
    if (sheetId === activeSheet) return;
    
    setIsLoading(true);
    // Simulate loading delay for better UX
    await new Promise(resolve => setTimeout(resolve, 150));
    setActiveSheet(sheetId);
    setIsLoading(false);
  };

  const formatCurrency = (value: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(parseInt(value.replace(/[^0-9]/g, '')));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`esg-workbook ${className}`}>
      {/* Workbook Header */}
      <div className="esg-workbook-header">
        <h2 className="esg-workbook-title">{data.metadata.title}</h2>
        <div className="esg-workbook-metadata">
          <span>Generated: {formatDate(data.metadata.generatedAt)}</span>
          <span>Portfolio Value: {formatCurrency(data.metadata.portfolioValue)}</span>
          <span>Total Emissions: {data.metadata.totalEmissions}</span>
          <span>Sheets: {data.sheets.length}</span>
        </div>
      </div>

      {/* Tab Strip */}
      <div className="esg-tab-strip">
        {data.sheets.map((sheet) => (
          <button
            key={sheet.id}
            className={`esg-tab ${activeSheet === sheet.id ? 'active' : ''}`}
            onClick={() => handleSheetChange(sheet.id)}
            disabled={isLoading}
          >
            {sheet.name}
          </button>
        ))}
        
        {/* Scroll Controls (for future use with many tabs) */}
        <div className="esg-scroll-controls">
          <button className="esg-scroll-btn" title="First">‹‹</button>
          <button className="esg-scroll-btn" title="Previous">‹</button>
          <button className="esg-scroll-btn" title="Next">›</button>
          <button className="esg-scroll-btn" title="Last">››</button>
        </div>
      </div>

      {/* Sheet Content */}
      <div className="esg-sheet-content">
        {isLoading ? (
          <div className="esg-loading">
            Loading sheet data...
          </div>
        ) : (
          currentSheet && (
            <div className="esg-fade-in">
              <ESGSheetRenderer sheet={currentSheet} />
            </div>
          )
        )}
      </div>
    </div>
  );
};

// Sheet content renderer
const ESGSheetRenderer: React.FC<{ sheet: ESGDemoSheet }> = ({ sheet }) => {
  switch (sheet.type) {
    case 'financed-emissions':
      return <FinancedEmissionsSheet data={sheet.data} title={sheet.name} />;
    case 'data-quality':
      return <DataQualitySheet data={sheet.data} title={sheet.name} />;
    default:
      return (
        <div>
          <div className="esg-sheet-header">
            <h3 className="esg-sheet-title">{sheet.name}</h3>
            <p className="esg-sheet-subtitle">General sheet content</p>
          </div>
          <div>Sheet content for {sheet.name} is not yet implemented.</div>
        </div>
      );
  }
};
