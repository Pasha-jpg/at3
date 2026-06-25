import EditCommentClient from './EditCommentClient';

export async function generateStaticParams() {
  // ADD ALL YOUR COMMENT IDs HERE
  const allCommentIds = [
    '01krwdzpbv8xz4v9qbaakjwdb4',    // Your comment ID
    // Add ALL your comment IDs here
  ];
  
  // Also try to fetch from API
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
    const response = await fetch(`${baseUrl}/comments`, {
      cache: 'no-store',
      signal: AbortSignal.timeout(5000)
    });
    
    if (response.ok) {
      const data = await response.json();
      const comments = data.data || data || [];
      
      if (comments && Array.isArray(comments) && comments.length > 0) {
        const apiParams = comments.map((comment) => ({
          id: comment.id.toString(),
        }));
        
        // Merge with UUIDs, avoiding duplicates
        const allParams = [...allCommentIds.map(id => ({ id }))];
        apiParams.forEach(param => {
          if (!allParams.some(p => p.id === param.id)) {
            allParams.push(param);
          }
        });
        
        console.log(`Generated ${allParams.length} comment edit paths`);
        return allParams;
      }
    }
  } catch (error) {
    console.error('Failed to fetch comments:', error);
  }
  
  // Return UUIDs as fallback
  console.log(`Generated ${allCommentIds.length} comment edit paths (UUIDs only)`);
  return allCommentIds.map(id => ({ id }));
}

export default function EditCommentPage() {
  return <EditCommentClient />;
}