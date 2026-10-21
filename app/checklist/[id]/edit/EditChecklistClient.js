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

export default function EditChecklistClient() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    is_completed: false,
    task_id: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [itemRes, tasksRes] = await Promise.all([
          api.get(`/checklist-items/${params.id}`),
          api.get('/tasks').catch(() => ({ data: [] }))
        ]);

        const itemData = itemRes.data?.data || itemRes.data;
        
        if (!itemData || Object.keys(itemData).length === 0) {
          setNotFound(true);
          setLoading(false);
          return;
        }
        
        setFormData({
          name: itemData.name || '',
          is_completed: itemData.is_completed || false,
          task_id: typeof itemData.task_id === 'object' 
            ? (itemData.task_id?.id || '') 
            : (itemData.task_id || '')
        });

        // ✅ Safely extract tasks array
        setTasks(extractArray(tasksRes));
        setLoading(false);
      } catch (err) {
        if (err.response?.status === 404) {
          setNotFound(true);
        } else {
          setError(err.response?.data?.message || err.message || 'Failed to fetch checklist item');
        }
        setLoading(false);
      }
    };

    if (params.id) {
      fetchData();
    }
  }, [params.id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const payload = {
        name: formData.name,
        is_completed: formData.is_completed,
        task_id: formData.task_id || null,
      };

      await api.put(`/checklist-items/${params.id}`, payload);
      
      // Hard reload to prevent Next.js router caching issues
      window.location.href = `/checklist/${params.id}`;
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update checklist item');
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading checklist item...</div>;

  if (notFound) {
    return (
      <div className="p-8 text-center max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Checklist Item Not Found</h1>
        <a href="/checklist" className="bg-blue-500 text-white px-4 py-2 rounded inline-block">Back to Checklist</a>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          {/* ✅ Using <a> tag to prevent Next.js router crash */}
          <a href={`/checklist/${params.id}`} className="text-gray-600 hover:text-gray-800">
            ← Back to Checklist Item
          </a>
          <h1 className="text-2xl font-bold mt-2">Edit Checklist Item</h1>
        </div>
      </div>

      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Item Name *</label>
          <input
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleChange}
            className="shadow border rounded w-full py-2 px-3 text-gray-700"
          />
        </div>

        <div className="mb-4">
          <label className="flex items-center gap-2 text-gray-700 text-sm font-bold">
            <input
              type="checkbox"
              name="is_completed"
              checked={formData.is_completed}
              onChange={handleChange}
              className="w-5 h-5"
            />
            Mark as Completed
          </label>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">Task *</label>
          <select
            name="task_id"
            value={formData.task_id}
            onChange={handleChange}
            required
            className="shadow border rounded w-full py-2 px-3 text-gray-700"
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

        <div className="flex justify-end gap-4 border-t pt-6">
          {/* ✅ Using <a> tag for Cancel */}
          <a href={`/checklist/${params.id}`} className="bg-gray-300 px-4 py-2 rounded text-gray-800 hover:bg-gray-400">
            Cancel
          </a>
          <button type="submit" disabled={saving} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50">
            {saving ? 'Saving...' : 'Update Checklist Item'}
          </button>
        </div>
      </form>
    </div>
  );
}