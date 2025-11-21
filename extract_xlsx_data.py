#!/usr/bin/env python3
"""
Excel file data extraction script for ESG Scope 3 Demo
Extracts data from XLSX file and converts to readable formats
"""

import pandas as pd
import json
import sys
import os
from pathlib import Path

def extract_xlsx_data(file_path):
    """Extract data from XLSX file and return structured data"""
    
    print(f"Reading XLSX file: {file_path}")
    
    try:
        # Read all sheets from the Excel file
        excel_file = pd.ExcelFile(file_path)
        
        print(f"Found {len(excel_file.sheet_names)} sheets:")
        for i, sheet_name in enumerate(excel_file.sheet_names):
            print(f"  {i+1}. {sheet_name}")
        
        extracted_data = {
            "metadata": {
                "file_name": os.path.basename(file_path),
                "total_sheets": len(excel_file.sheet_names),
                "sheet_names": excel_file.sheet_names
            },
            "sheets": {}
        }
        
        # Extract data from each sheet
        for sheet_name in excel_file.sheet_names:
            print(f"\nProcessing sheet: {sheet_name}")
            
            try:
                # Read the sheet
                df = pd.read_excel(file_path, sheet_name=sheet_name)
                
                # Get basic info
                sheet_info = {
                    "name": sheet_name,
                    "rows": len(df),
                    "columns": len(df.columns),
                    "column_names": df.columns.tolist(),
                    "data": [],
                    "summary": {}
                }
                
                # Convert data to JSON-serializable format
                if not df.empty:
                    # Replace NaN values with None
                    df_clean = df.where(pd.notnull(df), None)
                    sheet_info["data"] = df_clean.to_dict('records')
                    
                    # Generate summary for numeric columns
                    numeric_columns = df.select_dtypes(include=['number']).columns
                    for col in numeric_columns:
                        sheet_info["summary"][col] = {
                            "count": int(df[col].count()),
                            "mean": float(df[col].mean()) if pd.notnull(df[col].mean()) else None,
                            "sum": float(df[col].sum()) if pd.notnull(df[col].sum()) else None,
                            "min": float(df[col].min()) if pd.notnull(df[col].min()) else None,
                            "max": float(df[col].max()) if pd.notnull(df[col].max()) else None
                        }
                
                extracted_data["sheets"][sheet_name] = sheet_info
                print(f"  - Extracted {len(df)} rows, {len(df.columns)} columns")
                
            except Exception as e:
                print(f"  - Error reading sheet '{sheet_name}': {e}")
                extracted_data["sheets"][sheet_name] = {
                    "name": sheet_name,
                    "error": str(e)
                }
        
        return extracted_data
        
    except Exception as e:
        print(f"Error reading Excel file: {e}")
        return None

def save_extracted_data(data, output_dir):
    """Save extracted data to various formats"""
    
    if not data:
        print("No data to save")
        return
    
    os.makedirs(output_dir, exist_ok=True)
    
    # Save complete data as JSON
    json_file = os.path.join(output_dir, "extracted_data.json")
    with open(json_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print(f"Saved complete data to: {json_file}")
    
    # Save each sheet as separate CSV
    for sheet_name, sheet_data in data["sheets"].items():
        if "data" in sheet_data and sheet_data["data"]:
            csv_file = os.path.join(output_dir, f"{sheet_name.replace(' ', '_').replace('/', '_')}.csv")
            df = pd.DataFrame(sheet_data["data"])
            df.to_csv(csv_file, index=False)
            print(f"Saved sheet '{sheet_name}' to: {csv_file}")
    
    # Create markdown summary
    md_file = os.path.join(output_dir, "data_summary.md")
    create_markdown_summary(data, md_file)
    print(f"Saved summary to: {md_file}")

def create_markdown_summary(data, output_file):
    """Create a markdown summary of the extracted data"""
    
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write("# ESC Scope 3 Demo - Excel Data Extraction Summary\n\n")
        
        f.write("## File Information\n")
        f.write(f"- **File Name**: {data['metadata']['file_name']}\n")
        f.write(f"- **Total Sheets**: {data['metadata']['total_sheets']}\n")
        f.write(f"- **Sheet Names**: {', '.join(data['metadata']['sheet_names'])}\n\n")
        
        f.write("## Sheet Details\n\n")
        
        for sheet_name, sheet_data in data["sheets"].items():
            f.write(f"### {sheet_name}\n\n")
            
            if "error" in sheet_data:
                f.write(f"**Error**: {sheet_data['error']}\n\n")
                continue
            
            f.write(f"- **Rows**: {sheet_data['rows']}\n")
            f.write(f"- **Columns**: {sheet_data['columns']}\n")
            f.write(f"- **Column Names**: {', '.join(sheet_data['column_names'])}\n\n")
            
            # Show summary statistics if available
            if sheet_data.get("summary"):
                f.write("#### Summary Statistics\n\n")
                f.write("| Column | Count | Mean | Sum | Min | Max |\n")
                f.write("|--------|-------|------|-----|-----|-----|\n")
                
                for col, stats in sheet_data["summary"].items():
                    mean_str = f"{stats['mean']:.2f}" if stats['mean'] is not None else "N/A"
                    sum_str = f"{stats['sum']:.2f}" if stats['sum'] is not None else "N/A"
                    min_str = f"{stats['min']:.2f}" if stats['min'] is not None else "N/A"
                    max_str = f"{stats['max']:.2f}" if stats['max'] is not None else "N/A"
                    
                    f.write(f"| {col} | {stats['count']} | {mean_str} | {sum_str} | {min_str} | {max_str} |\n")
                f.write("\n")
            
            # Show first few rows of data
            if sheet_data.get("data") and len(sheet_data["data"]) > 0:
                f.write("#### Sample Data (First 5 rows)\n\n")
                
                # Create table header
                columns = sheet_data["column_names"]
                f.write("| " + " | ".join(columns) + " |\n")
                f.write("| " + " | ".join(["---"] * len(columns)) + " |\n")
                
                # Show first 5 rows
                for i, row in enumerate(sheet_data["data"][:5]):
                    row_values = []
                    for col in columns:
                        value = row.get(col, "")
                        if value is None:
                            value = ""
                        elif isinstance(value, (int, float)):
                            value = str(value)
                        else:
                            value = str(value)[:50] + "..." if len(str(value)) > 50 else str(value)
                        row_values.append(value)
                    f.write("| " + " | ".join(row_values) + " |\n")
                f.write("\n")

def main():
    """Main execution function"""
    
    # File path
    file_path = "ESC Scope 3 Demo - Chat and Outputs.xlsx"
    output_dir = "extracted_xlsx_data"
    
    if not os.path.exists(file_path):
        print(f"Error: File '{file_path}' not found")
        return 1
    
    print("ESC Scope 3 Demo - Excel Data Extractor")
    print("=" * 50)
    
    # Extract data
    extracted_data = extract_xlsx_data(file_path)
    
    if extracted_data:
        # Save data
        save_extracted_data(extracted_data, output_dir)
        print(f"\nData extraction completed successfully!")
        print(f"Check the '{output_dir}' directory for extracted files.")
    else:
        print("Data extraction failed.")
        return 1
    
    return 0

if __name__ == "__main__":
    sys.exit(main())
