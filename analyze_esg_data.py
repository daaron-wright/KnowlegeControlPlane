#!/usr/bin/env python3
"""
Parse XLSX chat data to extract structured ESG analysis information
"""

import json
import re
import pandas as pd
from pathlib import Path

def extract_esg_data_from_chat(json_file_path):
    """Extract structured ESG data from chat conversation"""
    
    with open(json_file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    chat_data = data['sheets']['Financed Emissions Analysis']['data']
    
    # Extract all chat messages
    messages = []
    for row in chat_data:
        message = row.get('OMNIS is resoning….', '')
        if message and isinstance(message, str) and message.strip():
            messages.append(message.strip())
    
    # Combine all messages
    full_text = '\n'.join(messages)
    
    # Extract key metrics
    extracted_data = {
        'portfolio_analysis': {},
        'investment_metrics': {},
        'comparison_data': {},
        'asset_type_analysis': {},
        'raw_messages': messages
    }
    
    # Extract total CO2 equivalent
    co2_match = re.search(r'Total estimated CO2 equivalent for the 18 investments is (\d+) tCO2E', full_text)
    if co2_match:
        extracted_data['investment_metrics']['total_co2_equivalent'] = int(co2_match.group(1))
    
    # Extract existing L&G portfolio CO2
    lg_co2_match = re.search(r'compared to ([\d,]+) tCO2e \(2024 L&G Sustainability Report\)', full_text)
    if lg_co2_match:
        extracted_data['comparison_data']['lg_existing_portfolio_co2'] = int(lg_co2_match.group(1).replace(',', ''))
    
    # Extract investment count
    investment_count_match = re.search(r'(\d+) investments', full_text)
    if investment_count_match:
        extracted_data['investment_metrics']['total_investments'] = int(investment_count_match.group(1))
    
    # Extract conclusion
    conclusion_match = re.search(r'Conclusion: (.+?)(?=\n|$)', full_text, re.MULTILINE)
    if conclusion_match:
        extracted_data['portfolio_analysis']['conclusion'] = conclusion_match.group(1)
    
    # Find tabular data sections
    table_sections = []
    
    # Look for Carbon Intensity data
    carbon_intensity_pattern = r'Carbon Intensity \(tCO2e/£m\)'
    waci_pattern = r'Weighted Average Carbon Intensity \(WACI\)'
    temp_alignment_pattern = r'Portfolio Temperature Alignment \(C\)'
    
    # Extract metrics mentioned in the text
    metrics_found = []
    if re.search(carbon_intensity_pattern, full_text):
        metrics_found.append('Carbon Intensity (tCO2e/£m)')
    if re.search(waci_pattern, full_text):
        metrics_found.append('Weighted Average Carbon Intensity (WACI)')
    if re.search(temp_alignment_pattern, full_text):
        metrics_found.append('Portfolio Temperature Alignment (C)')
    
    extracted_data['portfolio_analysis']['metrics_analyzed'] = metrics_found
    
    # Extract asset type analysis
    asset_types = []
    bond_match = re.search(r'Carbon Intensity \(tCO2e/£m\) - Bond', full_text)
    real_estate_match = re.search(r'Carbon Intensity \(tCO2e/£m\) - Real Estate', full_text)
    
    if bond_match:
        asset_types.append('Bond')
    if real_estate_match:
        asset_types.append('Real Estate')
    
    extracted_data['asset_type_analysis']['asset_types_analyzed'] = asset_types
    
    return extracted_data

def create_structured_analysis(extracted_data, output_file):
    """Create a structured markdown analysis"""
    
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write("# ESG Scope 3 Demo - Structured Data Analysis\n\n")
        f.write("*Extracted from chat conversation in XLSX file*\n\n")
        
        f.write("## Executive Summary\n\n")
        
        # Investment metrics
        if 'investment_metrics' in extracted_data:
            metrics = extracted_data['investment_metrics']
            f.write("### Investment Portfolio Overview\n\n")
            
            if 'total_investments' in metrics:
                f.write(f"- **Total Investments Analyzed**: {metrics['total_investments']}\n")
            
            if 'total_co2_equivalent' in metrics:
                f.write(f"- **Total CO₂ Equivalent**: {metrics['total_co2_equivalent']} tCO₂e\n")
        
        # Comparison data
        if 'comparison_data' in extracted_data:
            comp = extracted_data['comparison_data']
            f.write("\n### Benchmark Comparison\n\n")
            
            if 'lg_existing_portfolio_co2' in comp:
                f.write(f"- **L&G Existing Portfolio CO₂**: {comp['lg_existing_portfolio_co2']:,} tCO₂e (2024 L&G Sustainability Report)\n")
                
                if 'total_co2_equivalent' in extracted_data.get('investment_metrics', {}):
                    new_co2 = extracted_data['investment_metrics']['total_co2_equivalent']
                    existing_co2 = comp['lg_existing_portfolio_co2']
                    percentage = (new_co2 / existing_co2) * 100
                    f.write(f"- **New Investments as % of Existing**: {percentage:.4f}%\n")
        
        # Portfolio analysis
        if 'portfolio_analysis' in extracted_data:
            analysis = extracted_data['portfolio_analysis']
            f.write("\n## Analysis Results\n\n")
            
            if 'metrics_analyzed' in analysis:
                f.write("### Key Metrics Evaluated\n\n")
                for metric in analysis['metrics_analyzed']:
                    f.write(f"- {metric}\n")
                f.write("\n")
            
            if 'conclusion' in analysis:
                f.write("### Conclusion\n\n")
                f.write(f"{analysis['conclusion']}\n\n")
        
        # Asset type analysis
        if 'asset_type_analysis' in extracted_data:
            asset_analysis = extracted_data['asset_type_analysis']
            f.write("## Asset Type Analysis\n\n")
            
            if 'asset_types_analyzed' in asset_analysis:
                f.write("### Asset Types Covered\n\n")
                for asset_type in asset_analysis['asset_types_analyzed']:
                    f.write(f"- {asset_type}\n")
                f.write("\n")
        
        f.write("## Data Source\n\n")
        f.write("- **File**: ESC Scope 3 Demo - Chat and Outputs.xlsx\n")
        f.write("- **Sheet**: Financed Emissions Analysis\n")
        f.write("- **Format**: Chat conversation with embedded analysis results\n")
        f.write("- **Analysis Date**: Extracted from OMNIS AI conversation\n\n")
        
        # Raw messages section
        if 'raw_messages' in extracted_data and extracted_data['raw_messages']:
            f.write("## Raw Chat Messages\n\n")
            f.write("*Note: This section contains the complete conversation for reference*\n\n")
            
            for i, message in enumerate(extracted_data['raw_messages'][:10], 1):  # First 10 messages
                f.write(f"### Message {i}\n\n")
                f.write(f"{message}\n\n")
            
            if len(extracted_data['raw_messages']) > 10:
                f.write(f"*... and {len(extracted_data['raw_messages']) - 10} more messages*\n\n")

def main():
    """Main execution function"""
    
    json_file = "extracted_xlsx_data/extracted_data.json"
    output_file = "esg_structured_analysis.md"
    
    print("ESG Data Structure Analyzer")
    print("=" * 40)
    
    # Extract structured data
    extracted_data = extract_esg_data_from_chat(json_file)
    
    # Create analysis
    create_structured_analysis(extracted_data, output_file)
    
    # Save structured data as JSON
    with open("esg_structured_data.json", 'w', encoding='utf-8') as f:
        json.dump(extracted_data, f, indent=2, ensure_ascii=False)
    
    print(f"Structured analysis saved to: {output_file}")
    print(f"Structured data saved to: esg_structured_data.json")
    
    # Print summary
    print("\n" + "=" * 40)
    print("EXTRACTION SUMMARY")
    print("=" * 40)
    
    if 'investment_metrics' in extracted_data:
        metrics = extracted_data['investment_metrics']
        if 'total_investments' in metrics:
            print(f"Total Investments: {metrics['total_investments']}")
        if 'total_co2_equivalent' in metrics:
            print(f"Total CO₂ Equivalent: {metrics['total_co2_equivalent']} tCO₂e")
    
    if 'comparison_data' in extracted_data:
        comp = extracted_data['comparison_data']
        if 'lg_existing_portfolio_co2' in comp:
            print(f"L&G Portfolio CO₂: {comp['lg_existing_portfolio_co2']:,} tCO₂e")
    
    if 'portfolio_analysis' in extracted_data:
        analysis = extracted_data['portfolio_analysis']
        if 'metrics_analyzed' in analysis:
            print(f"Metrics Analyzed: {len(analysis['metrics_analyzed'])}")
    
    print(f"Raw Messages: {len(extracted_data.get('raw_messages', []))}")

if __name__ == "__main__":
    main()
