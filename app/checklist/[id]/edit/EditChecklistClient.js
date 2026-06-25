"use client";
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';

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

        const itemData = itemRes.data;
        
        if (!itemData || Object.keys(itemData).length === 0) {
          setNotFound(true);
          setLoading(false);
          return;
        }
        
        setFormData({
          name: itemData.name || '',
          is_completed: itemData.is_completed || false,
          task_id: itemData.task_id || ''
        });

        setTasks(tasksRes.data || []);
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
      await api.put(`/checklist-items/${params.id}`, formData);
      router.push(`/checklist/${params.id}`);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update checklist item');
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="p-8 flex justify-center items-center min-h-[400px]">
      <div className="text-gray-500">Loading checklist item...</div>
    </div>
  );

  if (notFound) {
    return (
      <div className="p-8 text-center max-w-4xl mx-auto">
        <div className="bg-yellow-50 border border-yellow-200 rounded p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Checklist Item Not Found</h1>
          <p className="text-gray-600 mb-4">
            The checklist item with ID &quot;{params.id}&quot; doesn&apos;t exist.
          </p>
          <Link 
            href="/checklist" 
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded inline-block"
          >
            Back to Checklist Items
          </Link>
        </div>
      </div>
    );
  }

  if (error) return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="bg-red-50 border border-red-200 rounded p-4 text-red-600">
        <h3 className="font-semibold">Error Loading Checklist Item</h3>
        <p>{error}</p>
        <Link href="/checklist" className="text-blue-500 hover:underline mt-2 inline-block">
          ← Back to Checklist Items
        </Link>
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Link 
            href={`/checklist/${params.id}`} 
            className="text-gray-600 hover:text-gray-800 inline-flex items-center gap-1"
          >
            ← Back to Checklist Item
          </Link>
          <h1 className="text-2xl font-bold mt-2">Edit Checklist Item</h1>
        </div>
        <div className="text-sm text-gray-500">
          Item ID: #{params.id}
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded border border-red-200">
          Error: {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
            Item Name *
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
            placeholder="Enter checklist item name"
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

        <div className="flex items-center justify-end gap-4 border-t pt-6">
          <Link
            href={`/checklist/${params.id}`}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 transition-colors"
          >
            {saving ? 'Saving...' : 'Update Checklist Item'}
          </button>
        </div>
      </form>
    </div>
  );
}