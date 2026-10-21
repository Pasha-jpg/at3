import EditMilestoneClient from './EditMilestoneClient';
import { KNOWN_IDS, generateParams } from '@/lib/knownIds';

export async function generateStaticParams() {
  // ✅ Uses the IDs from knownIds.js
  // This is reliable and doesn't require an API call during dev/build
  const params = generateParams(KNOWN_IDS.milestones);
  
  console.log(`✅ Generated ${params.length} milestone edit paths from knownIds.js`);
  return params;
}

export default function EditMilestonePage() {
  return <EditMilestoneClient />;
}