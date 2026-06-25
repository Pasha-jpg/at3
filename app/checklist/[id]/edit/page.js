import EditChecklistClient from './EditChecklistClient';

export async function generateStaticParams() {
  // ADD ALL YOUR CHECKLIST ITEM IDs HERE
  const allChecklistIds = [
    '01krwdyb1f7azvn161egjftfh4',    // Your checklist item ID
    // Add ALL your checklist item IDs here
  ];
  
  // Also try to fetch from API
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
    const response = await fetch(`${baseUrl}/checklist-items`, {
      cache: 'no-store',
      signal: AbortSignal.timeout(5000)
    });
    
    if (response.ok) {
      const data = await response.json();
      const items = data.data || data || [];
      
      if (items && Array.isArray(items) && items.length > 0) {
        const apiParams = items.map((item) => ({
          id: item.id.toString(),
        }));
        
        // Merge with UUIDs, avoiding duplicates
        const allParams = [...allChecklistIds.map(id => ({ id }))];
        apiParams.forEach(param => {
          if (!allParams.some(p => p.id === param.id)) {
            allParams.push(param);
          }
        });
        
        console.log(`Generated ${allParams.length} checklist edit paths`);
        return allParams;
      }
    }
  } catch (error) {
    console.error('Failed to fetch checklist items:', error);
  }
  
  // Return UUIDs as fallback
  console.log(`Generated ${allChecklistIds.length} checklist edit paths (UUIDs only)`);
  return allChecklistIds.map(id => ({ id }));
}

export default function EditChecklistPage() {
  return <EditChecklistClient />;
}