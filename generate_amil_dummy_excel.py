#!/usr/bin/env python3
"""
Generate AMIL Dummy Excel File
Based on amil_excel_file_requirements.md and amil_dashboard_data_extraction.md
"""

import pandas as pd
from datetime import datetime
import random

def generate_dummy_excel():
    """Generate a comprehensive dummy Excel file for AMIL ESG analysis"""
    
    # Bond Holdings Sheet
    bond_data = [
        # From CSV analysis (13 bonds) - matching the dashboard exactly
        {
            'Issuer Name': 'Green Energy Solutions Ltd',
            'Internal ID': 'B001',
            'ISIN': 'GB00B123456',
            'Investment Value': 2800000,
            'Outstanding Amount': 140000000,
            'Ownership Stake': '2.0%',
            'Sector Classification': 'Energy',
            'Geography': 'United Kingdom',
            'Location': 'London, UK',
            'Asset Properties': 'Renewable: Wind/Solar',
            'Issuer Website': 'www.greenenergy.co.uk'
        },
        {
            'Issuer Name': 'Thames Utilities PLC',
            'Internal ID': 'B002',
            'ISIN': 'GB00B789012',
            'Investment Value': 3200000,
            'Outstanding Amount': 160000000,
            'Ownership Stake': '2.0%',
            'Sector Classification': 'Utilities',
            'Geography': 'United Kingdom',
            'Location': 'London, UK',
            'Asset Properties': 'Water/Waste Treatment',
            'Issuer Website': 'www.thameswater.co.uk'
        },
        {
            'Issuer Name': 'Scottish Power Holdings',
            'Internal ID': 'B003',
            'ISIN': 'GB00B345678',
            'Investment Value': 2900000,
            'Outstanding Amount': 145000000,
            'Ownership Stake': '2.0%',
            'Sector Classification': 'Utilities',
            'Geography': 'Scotland',
            'Location': 'Glasgow, Scotland',
            'Asset Properties': 'Wind/Hydro Generation',
            'Issuer Website': 'www.scottishpower.co.uk'
        },
        {
            'Issuer Name': 'North Sea Energy Corp',
            'Internal ID': 'B004',
            'ISIN': 'GB00B901234',
            'Investment Value': 3100000,
            'Outstanding Amount': 155000000,
            'Ownership Stake': '2.0%',
            'Sector Classification': 'Energy',
            'Geography': 'United Kingdom',
            'Location': 'Aberdeen, Scotland',
            'Asset Properties': 'Offshore Wind/Oil',
            'Issuer Website': 'www.northseaenergy.com'
        },
        {
            'Issuer Name': 'Renewable Power UK Ltd',
            'Internal ID': 'B005',
            'ISIN': 'GB00B567890',
            'Investment Value': 2700000,
            'Outstanding Amount': 135000000,
            'Ownership Stake': '2.0%',
            'Sector Classification': 'Energy',
            'Geography': 'United Kingdom',
            'Location': 'Cardiff, Wales',
            'Asset Properties': 'Solar/Wind Farms',
            'Issuer Website': 'www.renewablepower.co.uk'
        },
        {
            'Issuer Name': 'Offshore Wind Holdings',
            'Internal ID': 'B006',
            'ISIN': 'GB00B234567',
            'Investment Value': 3300000,
            'Outstanding Amount': 165000000,
            'Ownership Stake': '2.0%',
            'Sector Classification': 'Energy',
            'Geography': 'United Kingdom',
            'Location': 'Norfolk, UK',
            'Asset Properties': 'Offshore Wind Turbines',
            'Issuer Website': 'www.offshorewind.co.uk'
        },
        {
            'Issuer Name': 'Advanced Materials Group',
            'Internal ID': 'B007',
            'ISIN': 'GB00B890123',
            'Investment Value': 1800000,
            'Outstanding Amount': 90000000,
            'Ownership Stake': '2.0%',
            'Sector Classification': 'Materials',
            'Geography': 'United Kingdom',
            'Location': 'Manchester, UK',
            'Asset Properties': 'Carbon Fiber/Composites',
            'Issuer Website': 'www.advancedmaterials.co.uk'
        },
        {
            'Issuer Name': 'Sustainable Chemicals PLC',
            'Internal ID': 'B008',
            'ISIN': 'GB00B456789',
            'Investment Value': 1900000,
            'Outstanding Amount': 95000000,
            'Ownership Stake': '2.0%',
            'Sector Classification': 'Materials',
            'Geography': 'United Kingdom',
            'Location': 'Middlesbrough, UK',
            'Asset Properties': 'Bio-based Chemicals',
            'Issuer Website': 'www.sustainablechemicals.com'
        },
        {
            'Issuer Name': 'Green Building Materials',
            'Internal ID': 'B009',
            'ISIN': 'GB00B012345',
            'Investment Value': 2000000,
            'Outstanding Amount': 100000000,
            'Ownership Stake': '2.0%',
            'Sector Classification': 'Materials',
            'Geography': 'United Kingdom',
            'Location': 'Birmingham, UK',
            'Asset Properties': 'Eco-friendly Insulation',
            'Issuer Website': 'www.greenbuildingmats.co.uk'
        },
        {
            'Issuer Name': 'Circular Economy Corp',
            'Internal ID': 'B010',
            'ISIN': 'GB00B678901',
            'Investment Value': 1700000,
            'Outstanding Amount': 85000000,
            'Ownership Stake': '2.0%',
            'Sector Classification': 'Materials',
            'Geography': 'United Kingdom',
            'Location': 'Leeds, UK',
            'Asset Properties': 'Recycling Technology',
            'Issuer Website': 'www.circulareconomy.co.uk'
        },
        {
            'Issuer Name': 'UK Government Green Bond',
            'Internal ID': 'B011',
            'ISIN': 'GB00BGOV001',
            'Investment Value': 4500000,
            'Outstanding Amount': 22500000000,
            'Ownership Stake': '0.02%',
            'Sector Classification': 'Government',
            'Geography': 'United Kingdom',
            'Location': 'London, UK',
            'Asset Properties': 'Government Sovereign',
            'Issuer Website': 'www.gov.uk/gilts'
        },
        {
            'Issuer Name': 'UK Treasury Sustainability Bond',
            'Internal ID': 'B012',
            'ISIN': 'GB00BTRS001',
            'Investment Value': 4200000,
            'Outstanding Amount': 21000000000,
            'Ownership Stake': '0.02%',
            'Sector Classification': 'Government',
            'Geography': 'United Kingdom',
            'Location': 'London, UK',
            'Asset Properties': 'Treasury Sustainability',
            'Issuer Website': 'www.gov.uk/treasury'
        },
        {
            'Issuer Name': 'UK Infrastructure Bond',
            'Internal ID': 'B013',
            'ISIN': 'GB00BINF001',
            'Investment Value': 3800000,
            'Outstanding Amount': 19000000000,
            'Ownership Stake': '0.02%',
            'Sector Classification': 'Government',
            'Geography': 'United Kingdom',
            'Location': 'London, UK',
            'Asset Properties': 'Infrastructure Funding',
            'Issuer Website': 'www.gov.uk/infrastructure'
        }
    ]
    
    # Real Estate Equity Holdings Sheet - matching CSV (3 assets)
    real_estate_data = [
        {
            'Asset Name': 'Kings Cross Development Trust',
            'Internal ID': 'RE001',
            'Property ID': 'PROP-KC-001',
            'Investment Value': 8900000,
            'Ownership Stake': '75%',
            'Location': 'Kings Cross, London',
            'Property Size': '200,000 sq ft',
            'Utilization': '88%',
            'Green Design Rating': 'BREEAM Excellent',
            'Asset Properties': '200,000 sq ft, BREEAM Excellent',
            'Sector Classification': 'Materials',
            'Geography': 'United Kingdom',
            'Operator Website': 'www.kingscross.co.uk'
        },
        {
            'Asset Name': 'Birmingham Green Energy Hub',
            'Internal ID': 'RE002',
            'Property ID': 'PROP-BH-002',
            'Investment Value': 6700000,
            'Ownership Stake': '60%',
            'Location': 'Birmingham, UK',
            'Property Size': '150,000 sq ft',
            'Utilization': '95%',
            'Green Design Rating': 'LEED Gold',
            'Asset Properties': '150,000 sq ft, LEED Gold',
            'Sector Classification': 'Materials',
            'Geography': 'United Kingdom',
            'Operator Website': 'www.birminghamhub.co.uk'
        },
        {
            'Asset Name': 'Manchester Sustainable Housing',
            'Internal ID': 'RE003',
            'Property ID': 'PROP-MH-003',
            'Investment Value': 5400000,
            'Ownership Stake': '50%',
            'Location': 'Manchester, UK',
            'Property Size': '120,000 sq ft',
            'Utilization': '97%',
            'Green Design Rating': 'Energy A+',
            'Asset Properties': '120,000 sq ft, Energy A+',
            'Sector Classification': 'Government',
            'Geography': 'United Kingdom',
            'Operator Website': 'www.manchesterhousing.co.uk'
        }
    ]
    
    # Infrastructure Equity Holdings Sheet - matching CSV (2 assets)
    infrastructure_data = [
        {
            'Asset Name': 'North Sea Wind Farm Holdings',
            'Internal ID': 'IF001',
            'External ID': 'INFR-NSW-001',
            'Investment Value': 18500000,
            'Ownership Stake': '25%',
            'Location': 'North Sea, UK',
            'Asset Properties': '400MW Capacity, 85% Utilization',
            'Capacity': '400MW',
            'Utilization': '85%',
            'Technology Type': 'Offshore Wind',
            'Sector Classification': 'Energy',
            'Geography': 'United Kingdom',
            'Operator Website': 'www.northseawind.co.uk'
        },
        {
            'Asset Name': 'Cornwall Solar Energy Trust',
            'Internal ID': 'IF002',
            'External ID': 'INFR-CS-002',
            'Investment Value': 12300000,
            'Ownership Stake': '40%',
            'Location': 'Cornwall, UK',
            'Asset Properties': '250MW Solar, 92% Efficiency',
            'Capacity': '250MW',
            'Utilization': '92%',
            'Technology Type': 'Solar Farm',
            'Sector Classification': 'Energy',
            'Geography': 'United Kingdom',
            'Operator Website': 'www.cornwallsolar.co.uk'
        }
    ]
    
    # Create Excel writer object
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f'investment_data.xlsx'
    
    with pd.ExcelWriter(filename, engine='openpyxl') as writer:
        # Write each sheet
        pd.DataFrame(bond_data).to_excel(writer, sheet_name='Bond Holdings', index=False)
        pd.DataFrame(real_estate_data).to_excel(writer, sheet_name='Real Estate Equity', index=False)
        pd.DataFrame(infrastructure_data).to_excel(writer, sheet_name='Infrastructure Equity', index=False)
        
        # Create summary sheet
        summary_data = [
            {'Metric': 'Total Portfolio Value', 'Value': '$46,000,000', 'Notes': 'Sum of all investments'},
            {'Metric': 'Total Assets', 'Value': '18', 'Notes': '14 Bonds + 3 Real Estate + 2 Infrastructure (matching ESG dashboard)'},
            {'Metric': 'Bond Holdings Value', 'Value': '$42,000,000', 'Notes': '14 bond investments'},
            {'Metric': 'Real Estate Value', 'Value': '$21,000,000', 'Notes': '3 real estate investments'},
            {'Metric': 'Infrastructure Value', 'Value': '$30,800,000', 'Notes': '2 infrastructure investments'},
            {'Metric': 'Data Quality', 'Value': 'High', 'Notes': '75% high quality data sources'},
            {'Metric': 'PCAF Compliance', 'Value': 'Category 15', 'Notes': 'All investments PCAF compliant'},
            {'Metric': 'Total Emissions', 'Value': '180 tCO₂e', 'Notes': 'Portfolio financed emissions (matching dashboard)'},
            {'Metric': 'Carbon Intensity', 'Value': '42 tCO₂e/£m', 'Notes': 'Portfolio average (matching dashboard)'},
            {'Metric': 'Generated Date', 'Value': datetime.now().strftime("%Y-%m-%d"), 'Notes': 'File creation date'}
        ]
        pd.DataFrame(summary_data).to_excel(writer, sheet_name='Portfolio Summary', index=False)
        
        # Format the sheets
        for sheet_name in writer.sheets:
            worksheet = writer.sheets[sheet_name]
            
            # Auto-adjust column widths
            for column in worksheet.columns:
                max_length = 0
                column_letter = column[0].column_letter
                
                for cell in column:
                    try:
                        if len(str(cell.value)) > max_length:
                            max_length = len(str(cell.value))
                    except:
                        pass
                
                adjusted_width = min(max_length + 2, 50)
                worksheet.column_dimensions[column_letter].width = adjusted_width
    
    print(f"✅ Generated Excel file: {filename}")
    print(f"📊 Portfolio Summary:")
    print(f"   • Total Value: £89,700,000")
    print(f"   • Bond Holdings: 13 assets")
    print(f"   • Real Estate: 3 assets") 
    print(f"   • Infrastructure: 2 assets")
    print(f"   • Total Assets: 18 (matching ESG dashboard)")
    print(f"📈 Data Quality: 75% high quality sources")
    print(f"🌱 PCAF Category 15 compliant")
    print(f"📅 Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    return filename

if __name__ == "__main__":
    try:
        filename = generate_dummy_excel()
        print(f"\n✨ Successfully created: {filename}")
        print("📝 File includes:")
        print("   - Bond Holdings (13 assets)")
        print("   - Real Estate Equity (3 assets)")
        print("   - Infrastructure Equity (2 assets)")
        print("   - Portfolio Summary")
        print("\n🎯 Ready for AMIL ESG analysis workflow!")
        print("✅ Asset count now matches ESG dashboard: 18 total investments")
        
    except Exception as e:
        print(f"❌ Error generating Excel file: {e}")
        import traceback
        traceback.print_exc()
