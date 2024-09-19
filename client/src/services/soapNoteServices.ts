// Define the type for the billing data
interface BillingData {
    description: string;
    cpt: string;
    icd10: string;
}

export const parseBillingCodes = async (billingCodesText: string): Promise<BillingData[] | null> => {
    if(!billingCodesText || billingCodesText === "")return null;
    // Split the text into rows
    const rows = billingCodesText.trim().split('\n');
    // Remove the header row
    rows.shift();
    // remove blank row
    rows.shift();
    // Parse each row into an object
    return rows.map(row => {
      const columns = row.split('|').map(col => col.trim());
      return {
        description: columns[1],
        cpt: columns[2],
        icd10: columns[3],
      };
    });
};

export const convertToRawFormat = async (billingData: BillingData[]): Promise<string | null> => {
    if(!billingData)return null;
    // Define the header
    const header = '| Description | CPT | ICD-10 |';
  
    // Map the billing data to rows
    const rows = billingData.map(item => {
      return `| ${item.description} | ${item.cpt} | ${item.icd10} |`;
    });
    // blank row
    const blankRow = "|--------------------------|------|---------|";
    // Join the header and rows into a single string
    return [header, blankRow, ...rows].join('\n');
};