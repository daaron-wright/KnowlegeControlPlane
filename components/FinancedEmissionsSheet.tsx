import React from 'react';
import { FinancedEmissionsRow } from '../types/esg-demo';

interface FinancedEmissionsSheetProps {
  data: FinancedEmissionsRow[];
  title: string;
}

export const FinancedEmissionsSheet: React.FC<FinancedEmissionsSheetProps> = ({ 
  data, 
  title 
}) => {
  // Calculate summary statistics
  const totalInvestment = data.reduce((sum, row) => sum + row.investmentValue, 0);
  const totalEmissions = data.reduce((sum, row) => sum + row.emissions, 0);
  const avgEmissionsIntensity = data.length > 0 
    ? data.reduce((sum, row) => sum + row.emissionsIntensity, 0) / data.length 
    : 0;
  const highQualityCount = data.filter(row => row.dataQuality === 'High').length;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatNumber = (value: number, decimals: number = 1) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(value);
  };

  const getQualityBadgeClass = (quality: string) => {
    switch (quality.toLowerCase()) {
      case 'high': return 'quality-badge quality-high';
      case 'medium': return 'quality-badge quality-medium';
      case 'low': return 'quality-badge quality-low';
      default: return 'quality-badge';
    }
  };

  return (
    <div>
      <div className="esg-sheet-header">
        <h3 className="esg-sheet-title">{title}</h3>
        <p className="esg-sheet-subtitle">
          PCAF Category 15 compliant financed emissions analysis with investment attribution
        </p>
      </div>

      {/* Summary Cards */}
      <div className="esg-summary-cards">
        <div className="esg-summary-card">
          <h4 className="esg-summary-card-title">Total Investment</h4>
          <p className="esg-summary-card-value">{formatCurrency(totalInvestment)}</p>
          <p className="esg-summary-card-subtitle">{data.length} investments</p>
        </div>
        <div className="esg-summary-card">
          <h4 className="esg-summary-card-title">Total Financed Emissions</h4>
          <p className="esg-summary-card-value">{formatNumber(totalEmissions)} tCO₂e</p>
          <p className="esg-summary-card-subtitle">Scope 3, Category 15</p>
        </div>
        <div className="esg-summary-card">
          <h4 className="esg-summary-card-title">Avg. Emissions Intensity</h4>
          <p className="esg-summary-card-value">{formatNumber(avgEmissionsIntensity)} tCO₂e/M$</p>
          <p className="esg-summary-card-subtitle">Per million invested</p>
        </div>
        <div className="esg-summary-card">
          <h4 className="esg-summary-card-title">Data Quality</h4>
          <p className="esg-summary-card-value">{Math.round((highQualityCount / data.length) * 100)}%</p>
          <p className="esg-summary-card-subtitle">High quality data</p>
        </div>
      </div>

      {/* Detailed Data Table */}
      <table className="esg-data-table">
        <thead>
          <tr>
            <th>Investment Name</th>
            <th>Asset Class</th>
            <th>Sector</th>
            <th>Investment Value</th>
            <th>Financed Emissions</th>
            <th>Emissions Intensity</th>
            <th>Data Quality</th>
            <th>PCAF Category</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx}>
              <td style={{ fontWeight: 500 }}>{row.investmentName}</td>
              <td>{row.assetClass}</td>
              <td>{row.sector}</td>
              <td className="currency">{formatCurrency(row.investmentValue)}</td>
              <td className="emissions">{formatNumber(row.emissions)} tCO₂e</td>
              <td className="numeric">{formatNumber(row.emissionsIntensity)} tCO₂e/M$</td>
              <td>
                <span className={getQualityBadgeClass(row.dataQuality)}>
                  {row.dataQuality}
                </span>
              </td>
              <td style={{ fontSize: '10px' }}>{row.pcafCategory}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr style={{ fontWeight: 600, background: '#f0f0f0' }}>
            <td colSpan={3}>TOTAL PORTFOLIO</td>
            <td className="currency">{formatCurrency(totalInvestment)}</td>
            <td className="emissions">{formatNumber(totalEmissions)} tCO₂e</td>
            <td className="numeric">{formatNumber(avgEmissionsIntensity)} tCO₂e/M$</td>
            <td colSpan={2}>
              <span className={getQualityBadgeClass('high')}>
                {Math.round((highQualityCount / data.length) * 100)}% High Quality
              </span>
            </td>
          </tr>
        </tfoot>
      </table>

      {/* Methodology Notes */}
      <div style={{ marginTop: '24px', padding: '12px', background: '#f8f9fa', border: '1px solid #e9ecef', borderRadius: '4px' }}>
        <h4 style={{ margin: '0 0 8px 0', fontSize: '12px', fontWeight: 600, color: '#495057' }}>
          Methodology Notes
        </h4>
        <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '11px', color: '#6c757d' }}>
          <li>Financed emissions calculated using PCAF Category 15 methodology</li>
          <li>Emissions intensity expressed as tCO₂e per million dollars invested</li>
          <li>Data quality scoring follows PCAF guidelines (High: Score 1-2, Medium: Score 3, Low: Score 4-5)</li>
          <li>Attribution based on enterprise value including cash (EVIC) where available</li>
        </ul>
      </div>
    </div>
  );
};
