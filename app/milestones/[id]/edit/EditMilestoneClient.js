"use client";
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
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

export default function EditMilestoneClient() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending',
    due_date: '',
    project_id: ''
  });

  // Fetch milestone data and projects
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [milestoneRes, projectsRes] = await Promise.all([
          api.get(`/milestones/${params.id}`),
          api.get('/projects').catch(() => ({ data: [] }))
        ]);

        const milestoneData = milestoneRes.data?.data || milestoneRes.data;
        
        // Check if milestone exists
        if (!milestoneData || Object.keys(milestoneData).length === 0) {
          setNotFound(true);
          setLoading(false);
          return;
        }
        
        setFormData({
          title: milestoneData.title || '',
          description: milestoneData.description || '',
          status: milestoneData.status || 'pending',
          due_date: milestoneData.due_date ? milestoneData.due_date.split('T')[0] : '',
          // Safely extract ID if the API returns the project as an object instead of an ID
          project_id: typeof milestoneData.project_id === 'object' 
            ? (milestoneData.project_id?.id || '') 
            : (milestoneData.project_id || '')
        });

        // ✅ Safely extract projects array
        setProjects(extractArray(projectsRes));
        setLoading(false);
      } catch (err) {
        if (err.response?.status === 404) {
          setNotFound(true);
        } else {
          setError(err.response?.data?.message || err.message || 'Failed to fetch milestone');
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
      // ✅ Convert empty strings to null so Laravel doesn't crash
      const payload = {
        title: formData.title,
        description: formData.description || null,
        status: formData.status,
        due_date: formData.due_date || null,
        project_id: formData.project_id || null,
      };

      await api.put(`/milestones/${params.id}`, payload);
      router.push(`/milestones/${params.id}`);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update milestone');
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading milestone...</div>;

  if (notFound) {
    return (
      <div className="p-8 text-center max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Milestone Not Found</h1>
        <Link href="/milestones" className="bg-blue-500 text-white px-4 py-2 rounded">Back to Milestones</Link>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Link href={`/milestones/${params.id}`} className="text-gray-600 hover:text-gray-800">← Back to Milestone</Link>
          <h1 className="text-2xl font-bold mt-2">Edit Milestone</h1>
        </div>
      </div>

      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Title *</label>
          <input
            name="title"
            type="text"
            required
            value={formData.title}
            onChange={handleChange}
            className="shadow border rounded w-full py-2 px-3 text-gray-700"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
          <textarea
            name="description"
            rows="4"
            value={formData.description}
            onChange={handleChange}
            className="shadow border rounded w-full py-2 px-3 text-gray-700"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="shadow border rounded w-full py-2 px-3 text-gray-700"
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Due Date</label>
            <input
              name="due_date"
              type="date"
              value={formData.due_date}
              onChange={handleChange}
              className="shadow border rounded w-full py-2 px-3 text-gray-700"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">Project</label>
          <select
            name="project_id"
            value={formData.project_id}
            onChange={handleChange}
            className="shadow border rounded w-full py-2 px-3 text-gray-700"
          >
            <option value="">Select a project...</option>
            {/* ✅ Array.isArray() prevents the crash */}
            {Array.isArray(projects) && projects.map(project => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end gap-4 border-t pt-6">
          <Link href={`/milestones/${params.id}`} className="bg-gray-300 px-4 py-2 rounded">Cancel</Link>
          <button type="submit" disabled={saving} className="bg-blue-500 text-white px-4 py-2 rounded">
            {saving ? 'Saving...' : 'Update Milestone'}
          </button>
        </div>
      </form>
    </div>
  );
}