"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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

export default function CreateCommentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  
  const [formData, setFormData] = useState({
    content: '',
    task_id: '',
    user_id: ''
  });

  // Fetch tasks and users for dropdowns
  useEffect(() => {
    Promise.all([
      api.get('/tasks').catch(() => ({ data: [] })),
      api.get('/users').catch(() => ({ data: [] }))
    ])
      .then(([tasksRes, usersRes]) => {
        // ✅ Safely extract arrays
        setTasks(extractArray(tasksRes));
        setUsers(extractArray(usersRes));
      })
      .catch(err => {
        console.error('Failed to fetch data:', err);
        setTasks([]);
        setUsers([]);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        content: formData.content,
        task_id: formData.task_id || null,
        user_id: formData.user_id || null,
      };

      const response = await api.post('/comments', payload);
      
      // Safely extract ID and redirect
      const newComment = response.data?.data || response.data;
      if (newComment && newComment.id) {
        router.push(`/comments/${newComment.id}`);
      } else {
        router.push('/comments');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to create comment');
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Create New Comment</h1>
        <Link href="/comments" className="text-gray-600 hover:text-gray-800">
          ← Back to Comments
        </Link>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          Error: {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="content">
            Comment *
          </label>
          <textarea
            id="content"
            name="content"
            rows="4"
            required
            value={formData.content}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter your comment"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="task_id">
              Task *
            </label>
            <select
              id="task_id"
              name="task_id"
              value={formData.task_id}
              onChange={handleChange}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="">Select a task...</option>
              {/* ✅ Array.isArray() prevents the crash */}
              {Array.isArray(tasks) && tasks.map(task => (
                <option key={task.id} value={task.id}>
                  {task.title || task.name || 'Untitled Task'}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="user_id">
              User *
            </label>
            <select
              id="user_id"
              name="user_id"
              value={formData.user_id}
              onChange={handleChange}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="">Select a user...</option>
              {/* ✅ Array.isArray() prevents the crash */}
              {Array.isArray(users) && users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.name || user.email || 'Unknown User'}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 mt-6">
          <Link
            href="/comments"
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Comment'}
          </button>
        </div>
      </form>
    </div>
  );
}