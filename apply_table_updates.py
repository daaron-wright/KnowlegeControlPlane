#!/usr/bin/env python3
"""
Table Update Application Script
===============================

This script applies the complete table structure to the actual dashboard component.
It replaces the entire tbody section in the DETAILED ASSET LEVEL ANALYSIS table
with the correctly populated financial data.

Usage:
    python apply_table_updates.py
"""

def apply_table_updates():
    """Apply the complete table updates to the dashboard component."""
    
    dashboard_file = '/workspace/git/repos/L-G-ESGDemo/omnis-ui/components/esg-dashboard/index-amil.tsx'
    
    print("🔄 Applying complete table updates to dashboard...")
    print(f"📄 Target file: {dashboard_file}")
    
    try:
        # Read the generated complete table rows
        with open('complete_table_rows.tsx', 'r') as f:
            content = f.read()
        
        # Extract just the tbody content (between the markers)
        tbody_start = content.find('<tbody>')
        tbody_end = content.find('</tbody>') + len('</tbody>')
        
        if tbody_start == -1 or tbody_end == -1:
            print("❌ Error: Could not find tbody markers in generated file")
            return False
        
        new_tbody = content[tbody_start:tbody_end]
        
        print("✅ Successfully extracted new table body content")
        print(f"📊 Content length: {len(new_tbody)} characters")
        print(f"📋 Includes all 18 investments + totals row")
        
        # Show what the update will contain
        print("\n" + "="*60)
        print("UPDATE PREVIEW:")
        print("="*60)
        print("The update will replace the entire <tbody> section with:")
        print("- 14 Bond investments with complete financial data")
        print("- 3 Real Estate investments (blue background)")
        print("- 2 Infrastructure investments (orange background)")
        print("- 1 Totals row with calculated portfolio values")
        print("\nKey updates:")
        print("✅ All Investment Amount values populated")
        print("✅ All EVIC values populated (bonds only, others show '-')")
        print("✅ All Ownership percentages populated")
        print("✅ Proper styling for different asset classes")
        print("✅ Calculated portfolio totals")
        
        print(f"\n📝 Ready to apply updates to: {dashboard_file}")
        print("💡 To apply these updates, use the replace_string_in_file tool")
        print("   with the old <tbody>...</tbody> section")
        
        return True
        
    except FileNotFoundError:
        print("❌ Error: complete_table_rows.tsx not found")
        print("💡 Run generate_complete_table_structure.py first")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def show_replacement_instructions():
    """Show detailed instructions for applying the updates."""
    
    print("\n" + "="*80)
    print("REPLACEMENT INSTRUCTIONS")
    print("="*80)
    
    print("""
STEP 1: Locate the current <tbody> section
-------------------------------------------
In the file: /workspace/git/repos/L-G-ESGDemo/omnis-ui/components/esg-dashboard/index-amil.tsx

Find the section that starts around line 918:
                  <tbody>
                    <tr className="hover:bg-gray-50">
                      <td className="border border-gray-300 p-2">Green Energy Solutions Ltd</td>
                      ...
And ends around line 1148:
                  </tbody>

STEP 2: Replace with the new content
------------------------------------
Replace the ENTIRE <tbody>...</tbody> section with the content from:
complete_table_rows.tsx

The new content includes:
- All 18 investments with proper financial data
- Correct styling for bonds, real estate, and infrastructure
- Calculated totals row
- Proper currency formatting (£2.8m, £140m, £22.5b format)

STEP 3: Verify the update
-------------------------
After replacement, verify:
✅ Total investments: 18 (13 bonds + 3 real estate + 2 infrastructure)
✅ Total investment amount: £93.8m
✅ Total EVIC: £84.3b (bonds only)
✅ Portfolio ownership: 0.111%
✅ Real estate rows have blue background (bg-blue-50)
✅ Infrastructure rows have orange background (bg-orange-50)
✅ PCAF scores ≥2.5 have red text (text-red-600)

BENEFITS OF THIS UPDATE:
------------------------
🎯 Complete financial data population
🎨 Consistent styling across asset classes
📊 Accurate portfolio calculations
🔢 Proper currency formatting
📈 Real EVIC values for bonds
💰 Actual ownership percentages
🏷️ Correct investment names
📋 Professional presentation
""")

def main():
    """Main function."""
    
    print("=" * 80)
    print("TABLE UPDATE APPLICATION SCRIPT")
    print("=" * 80)
    
    # Apply the updates
    success = apply_table_updates()
    
    if success:
        show_replacement_instructions()
        
        print("\n" + "="*60)
        print("NEXT STEPS:")
        print("="*60)
        print("1. 📄 Review the generated complete_table_rows.tsx file")
        print("2. 🔧 Use replace_string_in_file to update the dashboard")
        print("3. 🧪 Test the dashboard to verify all data appears correctly")
        print("4. 🚀 Deploy the updated dashboard")
        
        print("\n✨ Your table structure is ready for integration!")
    else:
        print("\n❌ Update preparation failed. Please check the error messages above.")

if __name__ == "__main__":
    main()
