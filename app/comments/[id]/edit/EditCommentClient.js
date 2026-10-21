"use client";
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';

// ✅ Helper to safely extract array from API response
function extractArray(response) {
  if (!response) return [];
  if (Array.isArray(response)) return response;
  if (Array.isArray(response.data)) return response.data;
  if (response.data?.data && Array.isArray(response.data.data)) return response.data.data;
  return [];
}

export default function EditCommentClient() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  
  const [formData, setFormData] = useState({
    content: '',
    task_id: '',
    user_id: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [commentRes, tasksRes, usersRes] = await Promise.all([
          api.get(`/comments/${params.id}`),
          api.get('/tasks').catch(() => ({ data: [] })),
          api.get('/users').catch(() => ({ data: [] }))
        ]);

        const commentData = commentRes.data?.data || commentRes.data;
        
        if (!commentData || Object.keys(commentData).length === 0) {
          setNotFound(true);
          setLoading(false);
          return;
        }
        
        setFormData({
          content: commentData.content || '',
          task_id: commentData.commentable_id || commentData.task_id || '',
          user_id: typeof commentData.user_id === 'object' 
            ? (commentData.user_id?.id || '') 
            : (commentData.user_id || '')
        });

        setTasks(extractArray(tasksRes));
        setUsers(extractArray(usersRes));
        setLoading(false);
      } catch (err) {
        if (err.response?.status === 404) {
          setNotFound(true);
        } else {
          setError(err.response?.data?.message || err.message || 'Failed to fetch comment');
        }
        setLoading(false);
      }
    };

    if (params.id) {
      fetchData();
    }
  }, [params.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const payload = {
        content: formData.content,
        user_id: formData.user_id || null,
        commentable_id: formData.task_id,
        commentable_type: 'App\\Models\\Task',
      };

      await api.put(`/comments/${params.id}`, payload);
      
      // Hard reload to prevent Next.js router caching issues on static export
      window.location.href = `/comments/${params.id}`;
    } catch (err) {
      console.error("❌ API Error:", err.response?.data);
      setError(err.response?.data?.message || err.message || 'Failed to update comment');
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading comment...</div>;

  if (notFound) {
    return (
      <div className="p-8 text-center max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Comment Not Found</h1>
        <a href="/comments" className="bg-blue-500 text-white px-4 py-2 rounded inline-block">Back to Comments</a>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          {/* ✅ Using <a> tag to prevent Next.js router crash */}
          <a href={`/comments/${params.id}`} className="text-gray-600 hover:text-gray-800">
            ← Back to Comment
          </a>
          <h1 className="text-2xl font-bold mt-2">Edit Comment</h1>
        </div>
      </div>

      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Comment *</label>
          <textarea
            name="content"
            rows="4"
            required
            value={formData.content}
            onChange={handleChange}
            className="shadow border rounded w-full py-2 px-3 text-gray-700"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Task *</label>
            <select
              name="task_id"
              value={formData.task_id}
              onChange={handleChange}
              required
              className="shadow border rounded w-full py-2 px-3 text-gray-700"
            >
              <option value="">Select a task...</option>
              {Array.isArray(tasks) && tasks.map(task => (
                <option key={task.id} value={task.id}>
                  {task.title || task.name || 'Untitled Task'}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">User *</label>
            <select
              name="user_id"
              value={formData.user_id}
              onChange={handleChange}
              required
              className="shadow border rounded w-full py-2 px-3 text-gray-700"
            >
              <option value="">Select a user...</option>
              {Array.isArray(users) && users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.name || user.email || 'Unknown User'}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-4 border-t pt-6">
          {/* ✅ Using <a> tag for Cancel */}
          <a href={`/comments/${params.id}`} className="bg-gray-300 px-4 py-2 rounded text-gray-800 hover:bg-gray-400">
            Cancel
          </a>
          <button type="submit" disabled={saving} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50">
            {saving ? 'Saving...' : 'Update Comment'}
          </button>
        </div>
      </form>
    </div>
  );
}