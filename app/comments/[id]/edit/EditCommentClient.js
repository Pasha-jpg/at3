"use client";
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';

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

  // Fetch comment data, tasks, and users
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [commentRes, tasksRes, usersRes] = await Promise.all([
          api.get(`/comments/${params.id}`),
          api.get('/tasks').catch(() => ({ data: [] })),
          api.get('/users').catch(() => ({ data: [] }))
        ]);

        const commentData = commentRes.data;
        
        // Check if comment exists
        if (!commentData || Object.keys(commentData).length === 0) {
          setNotFound(true);
          setLoading(false);
          return;
        }
        
        setFormData({
          content: commentData.content || '',
          task_id: commentData.task_id || '',
          user_id: commentData.user_id || ''
        });

        setTasks(tasksRes.data || []);
        setUsers(usersRes.data || []);
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
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      await api.put(`/comments/${params.id}`, formData);
      router.push(`/comments/${params.id}`);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update comment');
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="p-8 flex justify-center items-center min-h-[400px]">
      <div className="text-gray-500">Loading comment...</div>
    </div>
  );

  if (notFound) {
    return (
      <div className="p-8 text-center max-w-4xl mx-auto">
        <div className="bg-yellow-50 border border-yellow-200 rounded p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Comment Not Found</h1>
          <p className="text-gray-600 mb-4">
            The comment with ID &quot;{params.id}&quot; doesn&apos;t exist.
          </p>
          <Link 
            href="/comments" 
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded inline-block"
          >
            Back to Comments
          </Link>
        </div>
      </div>
    );
  }

  if (error) return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="bg-red-50 border border-red-200 rounded p-4 text-red-600">
        <h3 className="font-semibold">Error Loading Comment</h3>
        <p>{error}</p>
        <Link href="/comments" className="text-blue-500 hover:underline mt-2 inline-block">
          ← Back to Comments
        </Link>
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Link 
            href={`/comments/${params.id}`} 
            className="text-gray-600 hover:text-gray-800 inline-flex items-center gap-1"
          >
            ← Back to Comment
          </Link>
          <h1 className="text-2xl font-bold mt-2">Edit Comment</h1>
        </div>
        <div className="text-sm text-gray-500">
          Comment ID: #{params.id}
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded border border-red-200">
          Error: {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8">
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
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
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
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
            >
              <option value="">Select a task...</option>
              {tasks.map(task => (
                <option key={task.id} value={task.id}>
                  {task.title}
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
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
            >
              <option value="">Select a user...</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 border-t pt-6">
          <Link
            href={`/comments/${params.id}`}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 transition-colors"
          >
            {saving ? 'Saving...' : 'Update Comment'}
          </button>
        </div>
      </form>
    </div>
  );
}