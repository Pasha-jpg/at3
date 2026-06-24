"use client";
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';

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
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    due_date: '',
    assigned_to: '',
    project_id: ''
  });

  // Fetch task data and dropdown options
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [taskRes, projectsRes, usersRes] = await Promise.all([
          api.get(`/tasks/${params.id}`),
          api.get('/projects').catch(() => ({ data: [] })),
          api.get('/users').catch(() => ({ data: [] }))
        ]);

        const taskData = taskRes.data;
        
        // Check if task exists
        if (!taskData || Object.keys(taskData).length === 0) {
          setNotFound(true);
          setLoading(false);
          return;
        }
        
        setFormData({
          title: taskData.title || '',
          description: taskData.description || '',
          status: taskData.status || 'pending',
          priority: taskData.priority || 'medium',
          due_date: taskData.due_date ? taskData.due_date.split('T')[0] : '',
          assigned_to: taskData.assigned_to || '',
          project_id: taskData.project_id || ''
        });

        setProjects(projectsRes.data || []);
        setUsers(usersRes.data || []);
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
      await api.put(`/tasks/${params.id}`, formData);
      router.push(`/tasks/${params.id}`);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update task');
      setSaving(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800'
    };
    return colors[status] || 'bg-gray-100';
  };

  if (loading) return (
    <div className="p-8 flex justify-center items-center min-h-[400px]">
      <div className="text-gray-500">Loading task...</div>
    </div>
  );

  if (notFound) {
    return (
      <div className="p-8 text-center max-w-4xl mx-auto">
        <div className="bg-yellow-50 border border-yellow-200 rounded p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Task Not Found</h1>
          <p className="text-gray-600 mb-4">
            The task with ID &quot;{params.id}&quot; doesn&apos;t exist or hasn&apos;t been pre-generated.
          </p>
          <Link 
            href="/tasks" 
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded inline-block"
          >
            Back to Tasks
          </Link>
        </div>
      </div>
    );
  }

  if (error) return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="bg-red-50 border border-red-200 rounded p-4 text-red-600">
        <h3 className="font-semibold">Error Loading Task</h3>
        <p>{error}</p>
        <Link href="/tasks" className="text-blue-500 hover:underline mt-2 inline-block">
          ← Back to Tasks
        </Link>
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Link 
            href={`/tasks/${params.id}`} 
            className="text-gray-600 hover:text-gray-800 inline-flex items-center gap-1"
          >
            ← Back to Task
          </Link>
          <h1 className="text-2xl font-bold mt-2">Edit Task</h1>
        </div>
        <div className="text-sm text-gray-500">
          Task ID: #{params.id}
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded border border-red-200">
          Error: {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
            Title *
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            value={formData.title}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
            placeholder="Enter task title"
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
            placeholder="Enter task description"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500 ${getStatusColor(formData.status)}`}
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="priority">
              Priority
            </label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="project_id">
              Project
            </label>
            <select
              id="project_id"
              name="project_id"
              value={formData.project_id}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
            >
              <option value="">Select a project...</option>
              {projects.map(project => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="assigned_to">
            Assign To
          </label>
          <select
            id="assigned_to"
            name="assigned_to"
            value={formData.assigned_to}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
          >
            <option value="">Unassigned</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-end gap-4 border-t pt-6">
          <Link
            href={`/tasks/${params.id}`}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 transition-colors"
          >
            {saving ? 'Saving...' : 'Update Task'}
          </button>
        </div>
      </form>
    </div>
  );
}