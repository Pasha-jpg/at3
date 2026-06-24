"use client";
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';

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

  // Fetch project data and users
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectRes, usersRes] = await Promise.all([
          api.get(`/projects/${params.id}`),
          api.get('/users').catch(() => ({ data: [] }))
        ]);

        const projectData = projectRes.data;
        
        // Check if project exists
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
          user_id: projectData.user_id || ''
        });

        setUsers(usersRes.data || []);
        setLoading(false);
      } catch (err) {
        if (err.response?.status === 404) {
          setNotFound(true);
        } else {
          setError(err.response?.data?.message || err.message || 'Failed to fetch project');
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
      await api.put(`/projects/${params.id}`, formData);
      router.push(`/projects/${params.id}`);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update project');
      setSaving(false);
    }
  };

  const getProjectStatus = (startDate, dueDate) => {
    const now = new Date();
    const start = startDate ? new Date(startDate) : null;
    const due = dueDate ? new Date(dueDate) : null;
    
    if (due && due < now) return 'overdue';
    if (start && start > now) return 'not-started';
    if (start && start <= now && (!due || due >= now)) return 'in-progress';
    return 'planning';
  };

  const getStatusColor = (status) => {
    const colors = {
      'overdue': 'bg-red-100 text-red-800',
      'not-started': 'bg-gray-100 text-gray-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      'planning': 'bg-yellow-100 text-yellow-800'
    };
    return colors[status] || 'bg-gray-100';
  };

  const getStatusText = (status) => {
    const texts = {
      'overdue': 'Overdue',
      'not-started': 'Not Started',
      'in-progress': 'In Progress',
      'planning': 'Planning'
    };
    return texts[status] || status;
  };

  const currentStatus = getProjectStatus(formData.start_date, formData.due_date);

  if (loading) return (
    <div className="p-8 flex justify-center items-center min-h-[400px]">
      <div className="text-gray-500">Loading project...</div>
    </div>
  );

  if (notFound) {
    return (
      <div className="p-8 text-center max-w-4xl mx-auto">
        <div className="bg-yellow-50 border border-yellow-200 rounded p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Project Not Found</h1>
          <p className="text-gray-600 mb-4">
            The project with ID &quot;{params.id}&quot; doesn&apos;t exist or hasn&apos;t been pre-generated.
          </p>
          <Link 
            href="/projects" 
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded inline-block"
          >
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  if (error) return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="bg-red-50 border border-red-200 rounded p-4 text-red-600">
        <h3 className="font-semibold">Error Loading Project</h3>
        <p>{error}</p>
        <Link href="/projects" className="text-blue-500 hover:underline mt-2 inline-block">
          ← Back to Projects
        </Link>
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Link 
            href={`/projects/${params.id}`} 
            className="text-gray-600 hover:text-gray-800 inline-flex items-center gap-1"
          >
            ← Back to Project
          </Link>
          <h1 className="text-2xl font-bold mt-2">Edit Project</h1>
        </div>
        <div className="text-sm text-gray-500">
          Project ID: #{params.id}
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded border border-red-200">
          Error: {error}
        </div>
      )}

      {/* Status indicator */}
      <div className="mb-4 p-3 bg-gray-50 rounded border border-gray-200">
        <span className="text-sm font-medium text-gray-700">Current Status: </span>
        <span className={`px-2 py-1 rounded text-xs ${getStatusColor(currentStatus)}`}>
          {getStatusText(currentStatus)}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
            Project Name *
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
            placeholder="Enter project name"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows="4"
            value={formData.description}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
            placeholder="Enter project description"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="start_date">
              Start Date
            </label>
            <input
              id="start_date"
              name="start_date"
              type="date"
              value={formData.start_date}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="due_date">
              Due Date
            </label>
            <input
              id="due_date"
              name="due_date"
              type="date"
              value={formData.due_date}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="user_id">
            Project Owner
          </label>
          <select
            id="user_id"
            name="user_id"
            value={formData.user_id}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
          >
            <option value="">Select an owner...</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-end gap-4 border-t pt-6">
          <Link
            href={`/projects/${params.id}`}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 transition-colors"
          >
            {saving ? 'Saving...' : 'Update Project'}
          </button>
        </div>
      </form>
    </div>
  );
}