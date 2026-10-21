import TaskDetailClient from './TaskDetailClient';
import { KNOWN_IDS, generateParams } from '@/lib/knownIds';

export async function generateStaticParams() {
  // ✅ Uses the hardcoded IDs from knownIds.js
  const params = generateParams(KNOWN_IDS.tasks);
  console.log(`✅ Generated ${params.length} task detail paths`);
  return params;
}

export default function TaskDetailPage() {
  return <TaskDetailClient />;
}