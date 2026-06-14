"use client";
import { useEffect, useState } from 'react';
import api from '@/lib/api';

export default function CommentsPage() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);  // Add error state

  useEffect(() => {
    api.get('/comments')
      .then(res => {
        // Normalize data
        const normalizedComments = (res.data || []).map(comment => ({
          id: comment.id,
          content: comment.content,
          user_id: comment.user_id,
          task_id: comment.task_id,
          created_at: comment.created_at,
        }));
        setComments(normalizedComments);
        setLoading(false);
      })
      .catch(err => {  // Add error handling
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8">Loading comments...</div>;
  if (error) return <div className="p-8 text-red-600">Error: {error}</div>;  // Show error

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">Comments</h1>
      <p className="text-gray-600 mb-6">View all task comments and discussions</p>  {/* ✅ Add description */}
      
      <div className="space-y-4">
        {comments.map(comment => (
          <div key={comment.id} className="border rounded-lg p-4 bg-gray-50 hover:shadow-md transition-shadow">
            <p className="text-gray-800">{comment.content || 'No content'}</p>
            <div className="flex gap-4 mt-2 text-sm text-gray-500">
              <span>User: {comment.user_id}</span>
              <span>Task: {comment.task_id}</span>
              <span>{comment.created_at?.split('T')[0] || 'N/A'}</span>
            </div>
          </div>
        ))}
      </div>
      
      {/* count footer */}
      <div className="mt-6 text-gray-500">
        Total comments: {comments.length}
      </div>
    </div>
  );
}