import TaskDetailClient from './TaskDetailClient';

// Generate a large range of static paths for detail pages
export async function generateStaticParams() {
  // Generate IDs from 1 to 1000 (adjust based on your needs)
  const maxIds = 1000;
  const params = [];
  
  for (let i = 1; i <= maxIds; i++) {
    params.push({ id: i.toString() });
  }
  
  // If you have specific UUIDs, add them here
  const knownIds = [
    '01krwdyb1acccffnrgcbf8wa4h',
    // Add more IDs you know exist
  ];
  
  knownIds.forEach(id => {
    params.push({ id });
  });
  
  console.log(`Generated ${params.length} detail paths`);
  return params;
}

export default function TaskDetailPage() {
  return <TaskDetailClient />;
}