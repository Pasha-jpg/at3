import EditMilestoneClient from './EditMilestoneClient';

// This runs on the server at build time
export async function generateStaticParams() {
  // ALWAYS return these UUIDs - this is the primary source
  const allMilestoneIds = [
    '01krwdznr0dpdgkk81gs3mgr0j',    // Your milestone ID
    // Add ALL your milestone IDs here
  ];
  
  // Also try to fetch from API
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
    const response = await fetch(`${baseUrl}/milestones`, {
      cache: 'no-store',
      signal: AbortSignal.timeout(5000)
    });
    
    if (response.ok) {
      const data = await response.json();
      const milestones = data.data || data || [];
      
      if (milestones && Array.isArray(milestones) && milestones.length > 0) {
        const apiParams = milestones.map((milestone) => ({
          id: milestone.id.toString(),
        }));
        
        // Merge with UUIDs, avoiding duplicates
        const allParams = [...allMilestoneIds.map(id => ({ id }))];
        apiParams.forEach(param => {
          if (!allParams.some(p => p.id === param.id)) {
            allParams.push(param);
          }
        });
        
        console.log(`Generated ${allParams.length} milestone edit paths (API + UUIDs)`);
        return allParams;
      }
    }
  } catch (error) {
    console.error('Failed to fetch milestones from API:', error);
  }
  
  // Return UUIDs as fallback
  console.log(`Generated ${allMilestoneIds.length} milestone edit paths (UUIDs only)`);
  return allMilestoneIds.map(id => ({ id }));
}

export default function EditMilestonePage() {
  return <EditMilestoneClient />;
}