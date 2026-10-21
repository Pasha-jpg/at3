"use client";
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';

function extractArray(response) {
  if (!response) return [];
  if (Array.isArray(response)) return response;
  if (Array.isArray(response.data)) return response.data;
  if (response.data?.data && Array.isArray(response.data.data)) return response.data.data;
  return [];
}

export default function EditTaskClient() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    due_date: '',
    assigned_to: '',
    project_id: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [taskRes, projectsRes, usersRes] = await Promise.all([
          api.get(`/tasks/${params.id}`),
          api.get('/projects').catch(() => ({ data: [] })),
          api.get('/users').catch(() => ({ data: [] }))
        ]);

        const taskData = taskRes.data?.data || taskRes.data;
        
        if (!taskData || Object.keys(taskData).length === 0) {
          setNotFound(true);
          setLoading(false);
          return;
        }
        
        setFormData({
          name: taskData.name || taskData.title || '',
          description: taskData.description || '',
          status: taskData.status || 'pending',
          priority: taskData.priority || 'medium',
          due_date: taskData.due_date ? taskData.due_date.split('T')[0] : '',
          assigned_to: taskData.assigned_to || '',
          project_id: taskData.project_id || ''
        });

        setProjects(extractArray(projectsRes));
        setUsers(extractArray(usersRes));
        setLoading(false);
      } catch (err) {
        if (err.response?.status === 404) {
          setNotFound(true);
        } else {
          setError(err.response?.data?.message || err.message || 'Failed to fetch task');
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
      const payload = {
        name: formData.name,
        description: formData.description || '',
        status: formData.status,
        priority: formData.priority,
        due_date: formData.due_date || '',
        project_id: formData.project_id || '',
        assigned_to: formData.assigned_to || '',
      };

      await api.put(`/tasks/${params.id}`, payload);
      router.push(`/tasks/${params.id}`);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update task');
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading task...</div>;

  if (notFound) {
    return (
      <div className="p-8 text-center max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Task Not Found</h1>
        {/* ✅ Using a standard <a> tag instead of Link */}
        <a href="/tasks" className="bg-blue-500 text-white px-4 py-2 rounded inline-block">Back to Tasks</a>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          {/* ✅ Using a standard <a> tag instead of Link */}
          <a href={`/tasks/${params.id}`} className="text-gray-600 hover:text-gray-800">
            ← Back to Task
          </a>
          <h1 className="text-2xl font-bold mt-2">Edit Task</h1>
        </div>
      </div>

      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Title *</label>
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
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Priority</label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="shadow border rounded w-full py-2 px-3 text-gray-700"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Project</label>
            <select
              name="project_id"
              value={formData.project_id}
              onChange={handleChange}
              className="shadow border rounded w-full py-2 px-3 text-gray-700"
            >
              <option value="">Select a project...</option>
              {Array.isArray(projects) && projects.map(project => (
                <option key={project.id} value={project.id}>{project.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">Assign To</label>
          <select
            name="assigned_to"
            value={formData.assigned_to}
            onChange={handleChange}
            className="shadow border rounded w-full py-2 px-3 text-gray-700"
          >
            <option value="">Unassigned</option>
            {Array.isArray(users) && users.map(user => (
              <option key={user.id} value={user.id}>{user.name}</option>
            ))}
          </select>
        </div>

        <div className="flex justify-end gap-4 border-t pt-6">
          {/* ✅ Using a standard <a> tag here too */}
          <a href={`/tasks/${params.id}`} className="bg-gray-300 px-4 py-2 rounded text-gray-800">
            Cancel
          </a>
          <button type="submit" disabled={saving} className="bg-blue-500 text-white px-4 py-2 rounded">
            {saving ? 'Saving...' : 'Update Task'}
          </button>
        </div>
      </form>
    </div>
  );
}