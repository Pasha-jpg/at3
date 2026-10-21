import EditCommentClient from './EditCommentClient';
import { KNOWN_IDS, generateParams } from '@/lib/knownIds';

export async function generateStaticParams() {
  // ✅ Uses the IDs from knownIds.js
  const params = generateParams(KNOWN_IDS.comments);
  console.log(`✅ Generated ${params.length} comment edit paths`);
  return params;
}

export default function EditCommentPage() {
  return <EditCommentClient />;
}