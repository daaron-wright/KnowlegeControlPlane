import React from 'react';
import { DataQualityRow } from '../types/esg-demo';

interface DataQualitySheetProps {
  data: DataQualityRow[];
  title: string;
}

export const DataQualitySheet: React.FC<DataQualitySheetProps> = ({ 
  data, 
  title 
}) => {
  // Calculate summary statistics
  const highQualityCount = data.filter(row => row.quality === 'High').length;
  const mediumQualityCount = data.filter(row => row.quality === 'Medium').length;
  const lowQualityCount = data.filter(row => row.quality === 'Low').length;
  const totalSources = data.length;
  
  const avgCoverage = data.reduce((sum, row) => {
    const coverage = parseInt(row.coverage.replace('%', ''));
    return sum + coverage;
  }, 0) / totalSources;

  const recentUpdates = data.filter(row => {
    const updateDate = new Date(row.lastUpdated);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return updateDate >= weekAgo;
  }).length;

  const getQualityBadgeClass = (quality: string) => {
    switch (quality.toLowerCase()) {
      case 'high': return 'quality-badge quality-high';
      case 'medium': return 'quality-badge quality-medium';
      case 'low': return 'quality-badge quality-low';
      default: return 'quality-badge';
    }
  };

  const getQualityColor = (quality: string) => {
    switch (quality.toLowerCase()) {
      case 'high': return '#2e7d32';
      case 'medium': return '#f57c00';
      case 'low': return '#d32f2f';
      default: return '#666';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCoverageColor = (coverage: string) => {
    const percent = parseInt(coverage.replace('%', ''));
    if (percent >= 85) return '#2e7d32';
    if (percent >= 70) return '#f57c00';
    return '#d32f2f';
  };

  const getRecommendationPriority = (recommendation: string) => {
    if (recommendation.toLowerCase().includes('critical') || recommendation.toLowerCase().includes('urgent')) {
      return 'high';
    }
    if (recommendation.toLowerCase().includes('enhance') || recommendation.toLowerCase().includes('improve')) {
      return 'medium';
    }
    return 'low';
  };

  const getPriorityBadgeClass = (priority: string) => {
    switch (priority) {
      case 'high': return 'quality-badge quality-low';
      case 'medium': return 'quality-badge quality-medium';
      case 'low': return 'quality-badge quality-high';
      default: return 'quality-badge';
    }
  };

  return (
    <div>
      <div className="esg-sheet-header">
        <h3 className="esg-sheet-title">{title}</h3>
        <p className="esg-sheet-subtitle">
          Data source validation, coverage analysis, and quality improvement recommendations
        </p>
      </div>

      {/* Summary Cards */}
      <div className="esg-summary-cards">
        <div className="esg-summary-card">
          <h4 className="esg-summary-card-title">Data Sources</h4>
          <p className="esg-summary-card-value">{totalSources}</p>
          <p className="esg-summary-card-subtitle">Active sources</p>
        </div>
        <div className="esg-summary-card">
          <h4 className="esg-summary-card-title">Average Coverage</h4>
          <p className="esg-summary-card-value">{Math.round(avgCoverage)}%</p>
          <p className="esg-summary-card-subtitle">Across all sources</p>
        </div>
        <div className="esg-summary-card">
          <h4 className="esg-summary-card-title">Quality Distribution</h4>
          <p className="esg-summary-card-value">
            <span style={{ color: getQualityColor('high'), fontSize: '14px' }}>{highQualityCount}</span>/
            <span style={{ color: getQualityColor('medium'), fontSize: '14px' }}>{mediumQualityCount}</span>/
            <span style={{ color: getQualityColor('low'), fontSize: '14px' }}>{lowQualityCount}</span>
          </p>
          <p className="esg-summary-card-subtitle">High/Medium/Low</p>
        </div>
        <div className="esg-summary-card">
          <h4 className="esg-summary-card-title">Recent Updates</h4>
          <p className="esg-summary-card-value">{recentUpdates}</p>
          <p className="esg-summary-card-subtitle">Updated this week</p>
        </div>
      </div>

      {/* Quality Overview Chart */}
      <div style={{ marginBottom: '24px', padding: '16px', background: '#f8f9fa', border: '1px solid #e9ecef', borderRadius: '4px' }}>
        <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 600 }}>Quality Score Distribution</h4>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div style={{ width: '12px', height: '12px', background: getQualityColor('high'), borderRadius: '2px' }}></div>
            <span>High Quality ({highQualityCount})</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div style={{ width: '12px', height: '12px', background: getQualityColor('medium'), borderRadius: '2px' }}></div>
            <span>Medium Quality ({mediumQualityCount})</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div style={{ width: '12px', height: '12px', background: getQualityColor('low'), borderRadius: '2px' }}></div>
            <span>Low Quality ({lowQualityCount})</span>
          </div>
        </div>
      </div>

      {/* Detailed Data Table */}
      <table className="esg-data-table">
        <thead>
          <tr>
            <th>Data Source</th>
            <th>Quality Score</th>
            <th>Coverage</th>
            <th>Last Updated</th>
            <th>Known Issues</th>
            <th>Recommendation</th>
            <th>Priority</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx}>
              <td style={{ fontWeight: 500 }}>{row.dataSource}</td>
              <td>
                <span className={getQualityBadgeClass(row.quality)}>
                  {row.quality}
                </span>
              </td>
              <td className="numeric" style={{ color: getCoverageColor(row.coverage), fontWeight: 500 }}>
                {row.coverage}
              </td>
              <td style={{ fontSize: '10px', color: '#666' }}>{formatDate(row.lastUpdated)}</td>
              <td style={{ fontSize: '10px' }}>
                {row.issues === 'None' ? (
                  <span style={{ color: '#2e7d32', fontStyle: 'italic' }}>None</span>
                ) : (
                  row.issues
                )}
              </td>
              <td style={{ fontSize: '10px' }}>{row.recommendation}</td>
              <td>
                <span className={getPriorityBadgeClass(getRecommendationPriority(row.recommendation))}>
                  {getRecommendationPriority(row.recommendation)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Action Items */}
      <div style={{ marginTop: '24px' }}>
        <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 600, color: '#495057' }}>
          Priority Action Items
        </h4>
        <div style={{ display: 'grid', gap: '8px' }}>
          {data
            .filter(row => getRecommendationPriority(row.recommendation) === 'high' || row.quality === 'Low')
            .map((row, idx) => (
              <div key={idx} style={{ 
                padding: '8px 12px', 
                background: '#fff3e0', 
                border: '1px solid #ffcc02', 
                borderRadius: '4px',
                fontSize: '11px'
              }}>
                <strong>{row.dataSource}:</strong> {row.recommendation}
                {row.issues !== 'None' && <span style={{ color: '#d32f2f' }}> (Issue: {row.issues})</span>}
              </div>
            ))
          }
        </div>
      </div>

      {/* Assessment Notes */}
      <div style={{ marginTop: '24px', padding: '12px', background: '#f8f9fa', border: '1px solid #e9ecef', borderRadius: '4px' }}>
        <h4 style={{ margin: '0 0 8px 0', fontSize: '12px', fontWeight: 600, color: '#495057' }}>
          Assessment Criteria
        </h4>
        <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '11px', color: '#6c757d' }}>
          <li><strong>High Quality:</strong> Primary data, recent updates, comprehensive coverage (&gt;85%)</li>
          <li><strong>Medium Quality:</strong> Mix of primary/secondary data, regular updates, good coverage (70-85%)</li>
          <li><strong>Low Quality:</strong> Secondary/proxy data, infrequent updates, limited coverage (&lt;70%)</li>
          <li><strong>Coverage:</strong> Percentage of portfolio entities with available data from source</li>
        </ul>
      </div>
    </div>
  );
};
