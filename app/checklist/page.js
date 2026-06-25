"use client";
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Link from 'next/link';

export default function ChecklistPage() {
  const [items, setItems] = useState([]);
  const [tasks, setTasks] = useState({}); // Task name mapping from your tasks API
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  // Delete handler
  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this checklist item?')) {
      try {
        await api.delete(`/checklist-items/${id}`);
        setItems(items.filter(item => item.id !== id));
      } catch (err) {
        alert('Failed to delete checklist item: ' + err.message);
      }
    }
  };

  // Toggle completion status
  const handleToggleComplete = async (id, currentStatus) => {
    try {
      await api.put(`/checklist-items/${id}`, {
        is_completed: !currentStatus
      });
      setItems(items.map(item => 
        item.id === id ? { ...item, is_completed: !currentStatus } : item
      ));
    } catch (err) {
      alert('Failed to update checklist item: ' + err.message);
    }
  };

  useEffect(() => {
    // Fetch checklist items and tasks (same as your tasks page)
    Promise.all([
      api.get('/checklist-items'),
      api.get('/tasks').catch(() => ({ data: [] })) // ✅ Using tasks API
    ])
      .then(([itemsRes, tasksRes]) => {
        // Create map for task names (same pattern as your tasks page)
        const taskMap = {};
        (tasksRes.data || []).forEach(task => {
          taskMap[task.id] = task.title;
        });
        setTasks(taskMap);

        // Normalize checklist items data
        const normalizedItems = (itemsRes.data || []).map(item => ({
          id: item.id,
          name: item.name || 'Untitled',
          is_completed: item.is_completed || false,
          task_id: item.task_id,
          created_at: item.created_at,
          updated_at: item.updated_at
        }));
        
        setItems(normalizedItems);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching checklist items:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Filter items based on completion status
  const filteredItems = filter === 'all' 
    ? items 
    : filter === 'completed' 
      ? items.filter(item => item.is_completed)
      : items.filter(item => !item.is_completed);

  const getStatusCount = (status) => {
    if (status === 'all') return items.length;
    if (status === 'completed') return items.filter(item => item.is_completed).length;
    return items.filter(item => !item.is_completed).length;
  };

  if (loading) return <div className="p-8">Loading checklist items...</div>;
  
  if (error) return (
    <div className="p-8 text-red-600">
      <h2 className="text-xl font-bold mb-2">Error Loading Checklist Items</h2>
      <p>{error}</p>
      <p className="text-sm text-gray-500 mt-2">Please check that the API endpoints exist.</p>
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-bold">Checklist Items</h1>
        <Link 
          href="/checklist/new" 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          + New Checklist Item
        </Link>
      </div>
      <p className="text-gray-600 mb-6">Track and manage task checklist items</p>
      
      {/* Filter Tabs */}
      <div className="flex gap-2 mb-4 border-b">
        {['all', 'pending', 'completed'].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 capitalize transition-colors ${
              filter === status 
                ? 'border-b-2 border-blue-500 text-blue-600 font-semibold' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {status === 'all' ? 'All' : status}
            <span className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded">
              {getStatusCount(status)}
            </span>
          </button>
        ))}
      </div>

      {filteredItems.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No {filter !== 'all' ? filter : ''} checklist items found. Click &quot;New Checklist Item&quot; to create one.
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left w-12">Status</th>
                  <th className="p-2 text-left">Name</th>
                  <th className="p-2 text-left">Task</th>
                  <th className="p-2 text-left">Created</th>
                  <th className="p-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map(item => (
                  <tr key={item.id} className="border-t hover:bg-gray-50">
                    <td className="p-2">
                      <input
                        type="checkbox"
                        checked={item.is_completed}
                        onChange={() => handleToggleComplete(item.id, item.is_completed)}
                        className="w-5 h-5 cursor-pointer"
                        aria-label={`Toggle completion for ${item.name}`}
                      />
                    </td>
                    <td className="p-2">
                      <Link href={`/checklist/${item.id}`} className="text-blue-600 hover:underline">
                        <span className={item.is_completed ? 'line-through text-gray-500' : ''}>
                          {item.name}
                        </span>
                      </Link>
                    </td>
                    <td className="p-2">
                      {/* ✅ Uses tasks map to display task name, same as your tasks page uses projects map */}
                      <Link href={`/tasks/${item.task_id}`} className="text-blue-600 hover:underline">
                        {tasks[item.task_id] || item.task_id || 'N/A'}
                      </Link>
                    </td>
                    <td className="p-2">
                      {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="p-2">
                      <div className="flex gap-2">
                        <Link 
                          href={`/checklist/${item.id}/edit`}
                          className="text-blue-500 hover:text-blue-700 text-sm transition-colors"
                        >
                          Edit
                        </Link>
                        <button 
                          onClick={() => handleDelete(item.id)}
                          className="text-red-500 hover:text-red-700 text-sm transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Footer with stats */}
          <div className="mt-4 flex justify-between items-center text-gray-500">
            <div>
              Showing {filteredItems.length} of {items.length} items
            </div>
            <div className="flex gap-4 text-sm">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 bg-gray-100 border rounded"></span> Pending
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 bg-green-100 border rounded"></span> Completed
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}