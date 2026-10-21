"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';

function extractArray(response) {
  if (!response) return [];
  if (Array.isArray(response)) return response;
  if (Array.isArray(response.data)) return response.data;
  if (response.data?.data && Array.isArray(response.data.data)) return response.data.data;
  return [];
}

export default function CreateTaskPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
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
    Promise.all([
      api.get('/projects').catch(() => ({ data: [] })),
      api.get('/users').catch(() => ({ data: [] }))
    ])
      .then(([projectsRes, usersRes]) => {
        setProjects(extractArray(projectsRes));
        setUsers(extractArray(usersRes));
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

    // ✅ Create the exact payload we are sending
    const payload = {
      name: formData.name,
      description: formData.description || '',
      status: formData.status,
      priority: formData.priority,
      due_date: formData.due_date || '',
      project_id: formData.project_id || '',
      assigned_to: formData.assigned_to || '',
    };

    console.log("🚀 SENDING TO BACKEND:", payload);

    try {
      const response = await api.post('/tasks', payload);
      console.log('✅ Success:', response.data);
      router.push('/tasks');
    } catch (err) {
      console.error("❌ FULL BACKEND ERROR:", err.response?.data);
      
      // Try to extract the exact error message to show on screen
      const data = err.response?.data;
      let errorMessage = "Failed to create task. Check console.";
      
      if (data?.message) {
        errorMessage = data.message;
      } else if (data?.errors) {
        const firstKey = Object.keys(data.errors)[0];
        errorMessage = `${firstKey}: ${data.errors[firstKey][0]}`;
      }

      setError(errorMessage);
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Create New Task</h1>
        <Link href="/tasks" className="text-gray-600 hover:text-gray-800">← Back to Tasks</Link>
      </div>

      {/* 🔴 THE EXACT ERROR WILL SHOW HERE */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-800 rounded border-2 border-red-500">
          <p className="font-bold">Backend Error:</p>
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8">
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
            rows="3"
            value={formData.description}
            onChange={handleChange}
            className="shadow border rounded w-full py-2 px-3 text-gray-700"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="shadow border rounded w-full py-2 px-3 text-gray-700"
            >
              <option value="pending">pending</option>
              <option value="in_progress">in_progress</option>
              <option value="in-progress">in-progress</option>
              <option value="completed">completed</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Priority</label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="shadow border rounded w-full py-2 px-3 text-gray-700"
            >
              <option value="low">low</option>
              <option value="medium">medium</option>
              <option value="high">high</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Project</label>
            <select
              name="project_id"
              value={formData.project_id}
              onChange={handleChange}
              className="shadow border rounded w-full py-2 px-3 text-gray-700"
            >
              <option value="">Select a project...</option>
              {projects.map(project => (
                <option key={project.id} value={project.id}>{project.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Assign To</label>
            <select
              name="assigned_to"
              value={formData.assigned_to}
              onChange={handleChange}
              className="shadow border rounded w-full py-2 px-3 text-gray-700"
            >
              <option value="">Unassigned</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>{user.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Link href="/tasks" className="bg-gray-300 px-4 py-2 rounded">Cancel</Link>
          <button type="submit" disabled={loading} className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50">
            {loading ? 'Creating...' : 'Create Task'}
          </button>
        </div>
      </form>
    </div>
  );
}