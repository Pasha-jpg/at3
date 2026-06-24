import EditProjectClient from './EditProjectClient';

// This runs on the server at build time
export async function generateStaticParams() {
  // Always return at least one path to avoid build errors
  const defaultParams = [{ id: '1' }];
  
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
    
    // Try to fetch projects from API
    const response = await fetch(`${baseUrl}/projects`, {
      cache: 'no-store',
      signal: AbortSignal.timeout(5000)
    });
    
    if (!response.ok) {
      console.warn('API returned error, using fallback params');
      return generateFallbackParams();
    }
    
    const data = await response.json();
    const projects = data.data || data || [];
    
    if (!projects || !Array.isArray(projects) || projects.length === 0) {
      console.warn('No projects found, using fallback params');
      return generateFallbackParams();
    }
    
    // Map projects to params
    const params = projects.map((project) => ({
      id: project.id.toString(),
    }));
    
    // Also add known UUIDs to be safe
    const knownUuids = [
      '01krwdyb16xrcwcqz400ngrbxa',
      '01krwdyb188czjfa7c2pktqehg', // Your new project ID
      // Add any other project UUIDs here
    ];
    
    knownUuids.forEach(id => {
      if (!params.some(p => p.id === id)) {
        params.push({ id });
      }
    });
    
    console.log(`Generated ${params.length} project edit paths`);
    return params.length > 0 ? params : generateFallbackParams();
    
  } catch (error) {
    console.error('Failed to generate static params for project edit:', error);
    return generateFallbackParams();
  }
}

function generateFallbackParams() {
  const params = [];
  
  // Generate numeric IDs from 1 to 100
  for (let i = 1; i <= 100; i++) {
    params.push({ id: i.toString() });
  }
  
  // ADD PROJECT IDs HERE
  const projectIds = [
    '01krwdyb16xrcwcqz400ngrbxa',    // Project 1
    '01krwdyb188czjfa7c2pktqehg',    // Project 2 
    // Add ALL your project IDs here
  ];
  
  projectIds.forEach(id => {
    if (!params.some(p => p.id === id)) {
      params.push({ id });
    }
  });
  
  console.log(`Generated ${params.length} fallback project edit paths`);
  return params;
}

export default function EditProjectPage() {
  return <EditProjectClient />;
}