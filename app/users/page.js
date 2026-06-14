"use client";
import { useEffect, useState } from 'react';
import api from '@/lib/api';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/users')
      .then(response => {
       
        const normalizedUsers = (response.data || []).map(user => ({
          id: user.id,
          name: user.name,
          email: typeof user.email === 'object' ? user.email.address : user.email,
          email_verified: typeof user.email === 'object' ? user.email.verified : null,
          workspace_id: user.workspace_id,
          created_at: user.created_at,
        }));
        setUsers(normalizedUsers);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="loading">Loading users...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="p-6">
      <h1 className="page-title">Users</h1>
      <p className="page-description mb-6">View and manage user accounts</p>

      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Verified</th>
              <th>Workspace ID</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  {user.email_verified === true && <span className="text-green-600">✓</span>}
                  {user.email_verified === false && <span className="text-yellow-600">⚠</span>}
                  {user.email_verified === null && '-'}
                </td>
                <td>{user.workspace_id || '-'}</td>
                <td>{user.created_at ? new Date(user.created_at).toLocaleDateString() : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-gray-500">
        Total users: {users.length}
      </div>
    </div>
  );
}