"use client";
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';

// ✅ Helper
function extractObject(response) {
  if (!response) return null;
  if (response.data && typeof response.data === 'object') {
    if (response.data.data && typeof response.data.data === 'object') {
      return response.data.data;
    }
    return response.data;
  }
  return null;
}

function extractArray(response) {
  if (!response) return [];
  if (Array.isArray(response)) return response;
  if (Array.isArray(response.data)) return response.data;
  if (response.data?.data && Array.isArray(response.data.data)) return response.data.data;
  return [];
}

export default function EditProjectClient() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    start_date: '',
    due_date: '',
    user_id: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectRes, usersRes] = await Promise.all([
          api.get(`/projects/${params.id}`),
          api.get('/users').catch(() => ({ data: [] }))
        ]);

        const projectData = extractObject(projectRes);
        if (!projectData || Object.keys(projectData).length === 0) {
          setNotFound(true);
          setLoading(false);
          return;
        }

        setFormData({
          name: projectData.name || '',
          description: projectData.description || '',
          start_date: projectData.start_date ? projectData.start_date.split('T')[0] : '',
          due_date: projectData.due_date ? projectData.due_date.split('T')[0] : '',
          user_id: typeof projectData.user_id === 'object' 
            ? (projectData.user_id?.id || '') 
            : (projectData.user_id || '')
        });

        // ✅ Safe array extraction
        const usersArray = extractArray(usersRes);
        setUsers(usersArray);
        setLoading(false);
      } catch (err) {
        if (err.response?.status === 404 || err.response?.status === 401) {
          setNotFound(true);
        } else {
          setError(err.response?.data?.message || err.message || 'Failed to fetch project');
        }
        setLoading(false);
      }
    };

    if (params.id) fetchData();
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
      await api.put(`/projects/${params.id}`, formData);
      router.push(`/projects/${params.id}`);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update project');
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading project...</div>;

  if (notFound) {
    return (
      <div className="p-8 text-center max-w-4xl mx-auto">
        <div className="bg-yellow-50 border border-yellow-200 rounded p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Project Not Found</h1>
          <p className="text-gray-600 mb-4">
            The project with ID &quot;{params.id}&quot; doesn&apos;t exist.
          </p>
          <Link href="/projects" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded inline-block">
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  if (error) return <div className="p-8 text-red-600">Error: {error}</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Link href={`/projects/${params.id}`} className="text-gray-600 hover:text-gray-800">
            ← Back to Project
          </Link>
          <h1 className="text-2xl font-bold mt-2">Edit Project</h1>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded border border-red-200">
          Error: {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Project Name *</label>
          <input
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
          <textarea
            name="description"
            rows="4"
            value={formData.description}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Start Date</label>
            <input
              name="start_date"
              type="date"
              value={formData.start_date}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Due Date</label>
            <input
              name="due_date"
              type="date"
              value={formData.due_date}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">Project Owner</label>
          <select
            name="user_id"
            value={formData.user_id}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
          >
            <option value="">Select an owner...</option>
            {/* ✅ Safe rendering */}
            {Array.isArray(users) && users.map(user => (
              <option key={user.id} value={user.id}>
                {user.name || user.email || 'Unknown User'}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-end gap-4 border-t pt-6">
          <Link
            href={`/projects/${params.id}`}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Update Project'}
          </button>
        </div>
      </form>
    </div>
  );
}