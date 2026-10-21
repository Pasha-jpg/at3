import EditProjectClient from './EditProjectClient';
import { KNOWN_IDS, generateParams } from '@/lib/knownIds';

export async function generateStaticParams() {
  const params = generateParams(KNOWN_IDS.projects);
  console.log(`✅ Generated ${params.length} project edit paths`);
  return params;
}

export default function EditProjectPage() {
  return <EditProjectClient />;
}