import EditTaskClient from './EditTaskClient';
import { KNOWN_IDS, generateParams } from '@/lib/knownIds';

export async function generateStaticParams() {
  // ✅ This uses the array from knownIds.js
  const params = generateParams(KNOWN_IDS.tasks);
  
  console.log(`✅ Generated ${params.length} task edit paths`);
  return params;
}

export default function EditTaskPage() {
  return <EditTaskClient />;
}