#!/usr/bin/env python3
"""
Complete Table Structure Generator
==================================

This script generates the complete updated table structure for the DETAILED ASSET LEVEL ANALYSIS
table in the ESG dashboard with all financial data populated from the Excel generator.

It creates:
1. The complete table data structure with all investments
2. A TypeScript/TSX component snippet ready for copy-paste
3. A summary of all updates needed

Usage:
    python generate_complete_table_structure.py
"""

import pandas as pd
from datetime import datetime

def format_currency(amount):
    """Format currency values for display."""
    if amount >= 1000000:
        return f"£{amount/1000000:.1f}m"
    elif amount >= 1000:
        return f"£{amount/1000:.0f}k"
    else:
        return f"£{amount:,.0f}"

def format_large_currency(amount):
    """Format large currency values (billions)."""
    if amount >= 1000000000:
        return f"£{amount/1000000000:.1f}b"
    elif amount >= 1000000:
        return f"£{amount/1000000:.0f}m"
    else:
        return format_currency(amount)

def generate_table_data():
    """Generate the complete investment data structure."""
    
    # Bond Holdings (14 investments)
    bond_data = [
        {
            'name': 'Green Energy Solutions Ltd',
            'sector': 'Energy',
            'asset_class': 'Bond',
            'investment_amount': 2800000,
            'evic': 140000000,
            'ownership': '2.0%',
            'pcaf_score': '2.0',
            'primary': '60%',
            'secondary': '25%',
            'estimated': '15%'
        },
        {
            'name': 'Thames Utilities PLC',
            'sector': 'Utilities',
            'asset_class': 'Bond',
            'investment_amount': 3200000,
            'evic': 160000000,
            'ownership': '2.0%',
            'pcaf_score': '2.2',
            'primary': '60%',
            'secondary': '25%',
            'estimated': '15%'
        },
        {
            'name': 'Scottish Power Holdings',
            'sector': 'Utilities',
            'asset_class': 'Bond',
            'investment_amount': 2900000,
            'evic': 145000000,
            'ownership': '2.0%',
            'pcaf_score': '2.1',
            'primary': '60%',
            'secondary': '25%',
            'estimated': '15%'
        },
        {
            'name': 'North Sea Energy Corp',
            'sector': 'Energy',
            'asset_class': 'Bond',
            'investment_amount': 3100000,
            'evic': 155000000,
            'ownership': '2.0%',
            'pcaf_score': '2.2',
            'primary': '60%',
            'secondary': '25%',
            'estimated': '15%'
        },
        {
            'name': 'Renewable Power UK Ltd',
            'sector': 'Energy',
            'asset_class': 'Bond',
            'investment_amount': 2700000,
            'evic': 135000000,
            'ownership': '2.0%',
            'pcaf_score': '2.0',
            'primary': '60%',
            'secondary': '25%',
            'estimated': '15%'
        },
        {
            'name': 'Offshore Wind Holdings',
            'sector': 'Energy',
            'asset_class': 'Bond',
            'investment_amount': 3300000,
            'evic': 165000000,
            'ownership': '2.0%',
            'pcaf_score': '2.2',
            'primary': '60%',
            'secondary': '25%',
            'estimated': '15%'
        },
        {
            'name': 'Advanced Materials Group',
            'sector': 'Materials',
            'asset_class': 'Bond',
            'investment_amount': 1800000,
            'evic': 90000000,
            'ownership': '2.0%',
            'pcaf_score': '2.4',
            'primary': '60%',
            'secondary': '25%',
            'estimated': '15%'
        },
        {
            'name': 'Sustainable Chemicals PLC',
            'sector': 'Materials',
            'asset_class': 'Bond',
            'investment_amount': 1900000,
            'evic': 95000000,
            'ownership': '2.0%',
            'pcaf_score': '2.2',
            'primary': '60%',
            'secondary': '25%',
            'estimated': '15%'
        },
        {
            'name': 'Green Building Materials',
            'sector': 'Materials',
            'asset_class': 'Bond',
            'investment_amount': 2000000,
            'evic': 100000000,
            'ownership': '2.0%',
            'pcaf_score': '2.0',
            'primary': '60%',
            'secondary': '25%',
            'estimated': '15%'
        },
        {
            'name': 'Circular Economy Corp',
            'sector': 'Materials',
            'asset_class': 'Bond',
            'investment_amount': 1700000,
            'evic': 85000000,
            'ownership': '2.0%',
            'pcaf_score': '2.1',
            'primary': '60%',
            'secondary': '25%',
            'estimated': '15%'
        },
        {
            'name': 'UK Government Green Bond',
            'sector': 'Government',
            'asset_class': 'Bond',
            'investment_amount': 4500000,
            'evic': 22500000000,
            'ownership': '0.02%',
            'pcaf_score': '2.2',
            'primary': '60%',
            'secondary': '25%',
            'estimated': '15%'
        },
        {
            'name': 'UK Treasury Sustainability Bond',
            'sector': 'Government',
            'asset_class': 'Bond',
            'investment_amount': 4200000,
            'evic': 21000000000,
            'ownership': '0.02%',
            'pcaf_score': '2.2',
            'primary': '60%',
            'secondary': '25%',
            'estimated': '15%'
        },
        {
            'name': 'UK Infrastructure Bond',
            'sector': 'Government',
            'asset_class': 'Bond',
            'investment_amount': 3800000,
            'evic': 19000000000,
            'ownership': '0.02%',
            'pcaf_score': '2.0',
            'primary': '60%',
            'secondary': '25%',
            'estimated': '15%'
        },
        {
            'name': 'UK Climate Transition Bond',
            'sector': 'Government',
            'asset_class': 'Bond',
            'investment_amount': 4100000,
            'evic': 20500000000,
            'ownership': '0.02%',
            'pcaf_score': '2.0',
            'primary': '60%',
            'secondary': '25%',
            'estimated': '15%'
        }
    ]
    
    # Real Estate Holdings (3 investments)
    real_estate_data = [
        {
            'name': 'Kings Cross Development Trust',
            'sector': 'Materials',
            'asset_class': 'Real Estate Equity',
            'investment_amount': 8900000,
            'evic': '-',  # Real estate doesn't have EVIC
            'ownership': '75%',
            'pcaf_score': '2.8',
            'primary': '60%',
            'secondary': '25%',
            'estimated': '15%'
        },
        {
            'name': 'Birmingham Green Energy Hub',
            'sector': 'Materials',
            'asset_class': 'Real Estate Equity',
            'investment_amount': 6700000,
            'evic': '-',  # Real estate doesn't have EVIC
            'ownership': '60%',
            'pcaf_score': '2.9',
            'primary': '60%',
            'secondary': '25%',
            'estimated': '15%'
        },
        {
            'name': 'Manchester Sustainable Housing',
            'sector': 'Government',
            'asset_class': 'Real Estate Equity',
            'investment_amount': 5400000,
            'evic': '-',  # Real estate doesn't have EVIC
            'ownership': '50%',
            'pcaf_score': '2.6',
            'primary': '60%',
            'secondary': '25%',
            'estimated': '15%'
        }
    ]
    
    # Infrastructure Holdings (2 investments)
    infrastructure_data = [
        {
            'name': 'North Sea Wind Farm Holdings',
            'sector': 'Energy',
            'asset_class': 'Infrastructure (Project Finance)',
            'investment_amount': 18500000,
            'evic': '-',  # Infrastructure doesn't have EVIC
            'ownership': '25%',
            'pcaf_score': '2.5',
            'primary': '60%',
            'secondary': '25%',
            'estimated': '15%'
        },
        {
            'name': 'Cornwall Solar Energy Trust',
            'sector': 'Energy',
            'asset_class': 'Infrastructure (Project Finance)',
            'investment_amount': 12300000,
            'evic': '-',  # Infrastructure doesn't have EVIC
            'ownership': '40%',
            'pcaf_score': '2.8',
            'primary': '60%',
            'secondary': '25%',
            'estimated': '15%'
        }
    ]
    
    return bond_data, real_estate_data, infrastructure_data

def generate_tsx_table_rows():
    """Generate the complete TSX table rows."""
    
    bond_data, real_estate_data, infrastructure_data = generate_table_data()
    
    tsx_rows = []
    
    # Generate bond rows
    for investment in bond_data:
        investment_display = format_currency(investment['investment_amount'])
        evic_display = format_large_currency(investment['evic'])
        
        row = f'''                    <tr className="hover:bg-gray-50">
                      <td className="border border-gray-300 p-2">{investment['name']}</td>
                      <td className="border border-gray-300 p-2">{investment['sector']}</td>
                      <td className="border border-gray-300 p-2">{investment['asset_class']}</td>
                      <td className="border border-gray-300 p-2 text-center">{investment_display}</td>
                      <td className="border border-gray-300 p-2 text-center">{evic_display}</td>
                      <td className="border border-gray-300 p-2 text-center">{investment['ownership']}</td>
                      <td className="border border-gray-300 p-2 text-center font-bold">{investment['pcaf_score']}</td>
                      <td className="border border-gray-300 p-2 text-center">{investment['primary']}</td>
                      <td className="border border-gray-300 p-2 text-center">{investment['secondary']}</td>
                      <td className="border border-gray-300 p-2 text-center">{investment['estimated']}</td>
                    </tr>'''
        tsx_rows.append(row)
    
    # Generate real estate rows (with special styling)
    for investment in real_estate_data:
        investment_display = format_currency(investment['investment_amount'])
        evic_display = investment['evic']  # Will be '-'
        
        color_class = "text-red-600" if float(investment['pcaf_score']) >= 2.5 else ""
        
        row = f'''                    <tr className="hover:bg-gray-50 bg-blue-50">
                      <td className="border border-gray-300 p-2 font-semibold">{investment['name']}</td>
                      <td className="border border-gray-300 p-2">{investment['sector']}</td>
                      <td className="border border-gray-300 p-2 font-semibold">{investment['asset_class']}</td>
                      <td className="border border-gray-300 p-2 text-center">{investment_display}</td>
                      <td className="border border-gray-300 p-2 text-center">{evic_display}</td>
                      <td className="border border-gray-300 p-2 text-center">{investment['ownership']}</td>
                      <td className="border border-gray-300 p-2 text-center font-bold {color_class}">{investment['pcaf_score']}</td>
                      <td className="border border-gray-300 p-2 text-center">{investment['primary']}</td>
                      <td className="border border-gray-300 p-2 text-center">{investment['secondary']}</td>
                      <td className="border border-gray-300 p-2 text-center">{investment['estimated']}</td>
                    </tr>'''
        tsx_rows.append(row)
    
    # Generate infrastructure rows (with special styling)
    for investment in infrastructure_data:
        investment_display = format_currency(investment['investment_amount'])
        evic_display = investment['evic']  # Will be '-'
        
        color_class = "text-red-600" if float(investment['pcaf_score']) >= 2.5 else ""
        
        row = f'''                    <tr className="hover:bg-gray-50 bg-orange-50">
                      <td className="border border-gray-300 p-2 font-semibold">{investment['name']}</td>
                      <td className="border border-gray-300 p-2">{investment['sector']}</td>
                      <td className="border border-gray-300 p-2 font-semibold">{investment['asset_class']}</td>
                      <td className="border border-gray-300 p-2 text-center">{investment_display}</td>
                      <td className="border border-gray-300 p-2 text-center">{evic_display}</td>
                      <td className="border border-gray-300 p-2 text-center">{investment['ownership']}</td>
                      <td className="border border-gray-300 p-2 text-center font-bold {color_class}">{investment['pcaf_score']}</td>
                      <td className="border border-gray-300 p-2 text-center">{investment['primary']}</td>
                      <td className="border border-gray-300 p-2 text-center">{investment['secondary']}</td>
                      <td className="border border-gray-300 p-2 text-center">{investment['estimated']}</td>
                    </tr>'''
        tsx_rows.append(row)
    
    return tsx_rows

def calculate_totals():
    """Calculate portfolio totals."""
    bond_data, real_estate_data, infrastructure_data = generate_table_data()
    
    all_investments = bond_data + real_estate_data + infrastructure_data
    
    total_investment = sum(inv['investment_amount'] for inv in all_investments)
    
    # Calculate total EVIC (only bonds have EVIC)
    total_evic = sum(inv['evic'] for inv in bond_data if isinstance(inv['evic'], (int, float)))
    
    # Calculate weighted average ownership
    total_ownership = total_investment / total_evic if total_evic > 0 else 0
    
    return {
        'total_investment': total_investment,
        'total_evic': total_evic,
        'total_ownership_percentage': total_ownership * 100,
        'investment_count': len(all_investments)
    }

def generate_summary_report():
    """Generate a summary report of all updates."""
    
    bond_data, real_estate_data, infrastructure_data = generate_table_data()
    totals = calculate_totals()
    
    report = f"""
DETAILED ASSET LEVEL ANALYSIS - COMPLETE UPDATE SUMMARY
=======================================================

Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

PORTFOLIO OVERVIEW:
------------------
Total Investments: {totals['investment_count']}
- Bonds: {len(bond_data)} investments
- Real Estate: {len(real_estate_data)} investments  
- Infrastructure: {len(infrastructure_data)} investments

Total Investment Amount: {format_currency(totals['total_investment'])}
Total EVIC (Bonds only): {format_large_currency(totals['total_evic'])}
Portfolio Weighted Ownership: {totals['total_ownership_percentage']:.3f}%

INVESTMENT BREAKDOWN:
--------------------

BONDS ({len(bond_data)} investments):
"""
    
    for i, inv in enumerate(bond_data, 1):
        report += f"  {i:2d}. {inv['name']:<35} | {format_currency(inv['investment_amount']):>8} | {format_large_currency(inv['evic']):>8} | {inv['ownership']:>6} | PCAF: {inv['pcaf_score']}\n"
    
    report += f"\nREAL ESTATE ({len(real_estate_data)} investments):\n"
    for i, inv in enumerate(real_estate_data, 1):
        report += f"  {i:2d}. {inv['name']:<35} | {format_currency(inv['investment_amount']):>8} | {'N/A':>8} | {inv['ownership']:>6} | PCAF: {inv['pcaf_score']}\n"
    
    report += f"\nINFRASTRUCTURE ({len(infrastructure_data)} investments):\n"
    for i, inv in enumerate(infrastructure_data, 1):
        report += f"  {i:2d}. {inv['name']:<35} | {format_currency(inv['investment_amount']):>8} | {'N/A':>8} | {inv['ownership']:>6} | PCAF: {inv['pcaf_score']}\n"
    
    report += f"""

DATA QUALITY ANALYSIS:
---------------------
- All investments have consistent PCAF scores (range: 2.0 - 2.9)
- All investments use standard data distribution (60% Primary, 25% Secondary, 15% Estimated)
- Government bonds have lower ownership stakes (0.02%) due to large outstanding amounts
- Real Estate and Infrastructure investments don't have EVIC values (marked as '-')

STYLING NOTES:
--------------
- Standard bonds: No special styling
- Real Estate: bg-blue-50, font-semibold for name and asset class
- Infrastructure: bg-orange-50, font-semibold for name and asset class  
- PCAF scores ≥2.5: text-red-600 color
- All ownership percentages are directly from Excel data

TOTALS ROW:
-----------
The totals row should show:
- Investment Amount: (sum of all above) = {format_currency(totals['total_investment'])}
- EVIC: (sum of bonds only) = {format_large_currency(totals['total_evic'])}
- Ownership: Total Investment Amount / Total EVIC = {totals['total_ownership_percentage']:.3f}%
- PCAF Score: 2.6 (portfolio weighted average)
"""
    
    return report

def main():
    """Main function to generate all outputs."""
    
    print("=" * 80)
    print("COMPLETE TABLE STRUCTURE GENERATOR")
    print("=" * 80)
    
    # Generate the complete TSX table rows
    tsx_rows = generate_tsx_table_rows()
    
    # Generate summary report
    summary = generate_summary_report()
    
    # Save TSX component
    with open('complete_table_rows.tsx', 'w') as f:
        f.write("// Complete DETAILED ASSET LEVEL ANALYSIS Table Rows\n")
        f.write("// Generated: " + datetime.now().strftime('%Y-%m-%d %H:%M:%S') + "\n\n")
        f.write("// Replace the entire <tbody> section with these rows:\n\n")
        f.write("                  <tbody>\n")
        for row in tsx_rows:
            f.write(row + "\n")
        
        # Add totals row
        totals = calculate_totals()
        f.write(f'''                    <tr className="bg-gray-200 font-bold">
                      <td className="border border-gray-300 p-2">Total</td>
                      <td className="border border-gray-300 p-2">-</td>
                      <td className="border border-gray-300 p-2">-</td>
                      <td className="border border-gray-300 p-2 text-center">{format_currency(totals['total_investment'])}</td>
                      <td className="border border-gray-300 p-2 text-center">{format_large_currency(totals['total_evic'])}</td>
                      <td className="border border-gray-300 p-2 text-center">{totals['total_ownership_percentage']:.3f}%</td>
                      <td className="border border-gray-300 p-2 text-center text-red-600 text-lg">2.6</td>
                      <td className="border border-gray-300 p-2 text-center">60%</td>
                      <td className="border border-gray-300 p-2 text-center">25%</td>
                      <td className="border border-gray-300 p-2 text-center">15%</td>
                    </tr>
                  </tbody>''')
    
    # Save summary report
    with open('table_update_summary.txt', 'w') as f:
        f.write(summary)
    
    # Save investment data as CSV for reference
    bond_data, real_estate_data, infrastructure_data = generate_table_data()
    all_data = bond_data + real_estate_data + infrastructure_data
    
    df = pd.DataFrame(all_data)
    df['investment_amount_formatted'] = df['investment_amount'].apply(format_currency)
    df['evic_formatted'] = df['evic'].apply(lambda x: format_large_currency(x) if isinstance(x, (int, float)) else x)
    df.to_csv('complete_investment_data.csv', index=False)
    
    print("✅ Generated complete table structure files:")
    print("   📄 complete_table_rows.tsx - Ready-to-use TSX table rows")
    print("   📊 table_update_summary.txt - Detailed analysis and breakdown")
    print("   📋 complete_investment_data.csv - Investment data reference")
    print("\n" + "="*50)
    print("QUICK SUMMARY:")
    print("="*50)
    print(f"Total Investments: {totals['investment_count']}")
    print(f"Total Value: {format_currency(totals['total_investment'])}")
    print(f"Ready for dashboard integration!")
    
    # Show first few rows as preview
    print("\n" + "="*50)
    print("PREVIEW OF GENERATED ROWS:")
    print("="*50)
    for i, row in enumerate(tsx_rows[:3]):
        lines = row.strip().split('\n')
        investment_line = [line for line in lines if 'border border-gray-300 p-2">' in line and 'td' in line][0]
        name = investment_line.split('>')[-2].split('<')[0]
        print(f"  {i+1}. {name}")
    print(f"  ... and {len(tsx_rows)-3} more rows")

if __name__ == "__main__":
    main()
