"use client";
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Link from 'next/link';

// ✅ Helper to safely extract array from API response
function extractArray(response) {
  if (!response) return [];
  if (Array.isArray(response)) return response;
  if (Array.isArray(response.data)) return response.data;
  if (response.data?.data && Array.isArray(response.data.data)) return response.data.data;
  return [];
}

export default function CommentsPage() {
  const [comments, setComments] = useState([]);
  const [tasks, setTasks] = useState({});
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this comment?')) {
      try {
        await api.delete(`/comments/${id}`);
        setComments(comments.filter(comment => comment.id !== id));
      } catch (err) {
        alert('Failed to delete comment: ' + err.message);
      }
    }
  };

  useEffect(() => {
    Promise.all([
      api.get('/comments'),
      api.get('/tasks').catch(() => ({ data: [] })),
      api.get('/users').catch(() => ({ data: [] }))
    ])
      .then(([commentsRes, tasksRes, usersRes]) => {
        // ✅ Safely extract arrays
        const commentsArray = extractArray(commentsRes);
        const tasksArray = extractArray(tasksRes);
        const usersArray = extractArray(usersRes);

        // Create map for task names
        const taskMap = {};
        tasksArray.forEach(task => {
          if (task && task.id) {
            taskMap[task.id] = task.title || 'Untitled Task';
          }
        });
        setTasks(taskMap);

        // Create map for user names
        const userMap = {};
        usersArray.forEach(user => {
          if (user && user.id) {
            userMap[user.id] = user.name || 'Unknown User';
          }
        });
        setUsers(userMap);

        // Normalize comments data
        const normalizedComments = commentsArray.map(comment => ({
          id: comment.id,
          content: comment.content || '',
          user_id: comment.user_id,
          task_id: comment.task_id,
          created_at: comment.created_at,
          updated_at: comment.updated_at
        }));
        
        setComments(normalizedComments);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching comments:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8">Loading comments...</div>;
  if (error) return <div className="p-8 text-red-600">Error: {error}</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-bold">Comments</h1>
        <Link 
          href="/comments/new" 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          + New Comment
        </Link>
      </div>
      <p className="text-gray-600 mb-6">View and manage task comments and discussions</p>
      
      {comments.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No comments found. Click &quot;New Comment&quot; to create one.
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left">Content</th>
                  <th className="p-2 text-left">Task</th>
                  <th className="p-2 text-left">User</th>
                  <th className="p-2 text-left">Created</th>
                  <th className="p-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {comments.map(comment => (
                  <tr key={comment.id} className="border-t hover:bg-gray-50">
                    <td className="p-2">
                      <Link href={`/comments/${comment.id}`} className="text-blue-600 hover:underline">
                        {comment.content?.substring(0, 60)}...
                      </Link>
                    </td>
                    <td className="p-2">
                      <Link href={`/tasks/${comment.task_id}`} className="text-blue-600 hover:underline">
                        {tasks[comment.task_id] || comment.task_id || 'N/A'}
                      </Link>
                    </td>
                    <td className="p-2">
                      {users[comment.user_id] || comment.user_id || 'Unknown'}
                    </td>
                    <td className="p-2">
                      {comment.created_at ? new Date(comment.created_at).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="p-2">
                      <div className="flex gap-2">
                        <Link 
                          href={`/comments/${comment.id}/edit`}
                          className="text-blue-500 hover:text-blue-700 text-sm transition-colors"
                        >
                          Edit
                        </Link>
                        <button 
                          onClick={() => handleDelete(comment.id)}
                          className="text-red-500 hover:text-red-700 text-sm transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 flex justify-between items-center text-gray-500">
            <div>
              Total comments: {comments.length}
            </div>
          </div>
        </>
      )}
    </div>
  );
}