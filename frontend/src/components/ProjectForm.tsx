'use client';

import { useState, useEffect } from 'react';
import { projectsAPI, clientsAPI } from '@/lib/api';
import { Client } from '@/lib/types';

interface ProjectFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  initialData?: any;
}

export function ProjectForm({
  onSuccess,
  onCancel,
  initialData,
}: ProjectFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    status: initialData?.status || 'Not Started',
    clientId: initialData?.clientId || '',
  });
  const [clients, setClients] = useState<Client[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await clientsAPI.getAll();
        setClients(response.data);
      } catch (err) {
        console.error('Failed to fetch clients');
      }
    };
    fetchClients();
  }, []);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('Project name is required');
      return;
    }

    if (!formData.clientId) {
      setError('Please select a client');
      return;
    }

    setLoading(true);
    try {
      if (initialData) {
        await projectsAPI.update(initialData.id, {
          ...formData,
          clientId: parseInt(formData.clientId as any),
        });
      } else {
        await projectsAPI.create({
          ...formData,
          clientId: parseInt(formData.clientId as any),
        });
      }
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to save project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Project Name *</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          placeholder="Enter project name"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Client *</label>
        <select
          name="clientId"
          value={formData.clientId}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="">Select a client</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          placeholder="Project description"
          rows={3}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Status</label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option>Not Started</option>
          <option>In Progress</option>
          <option>Completed</option>
        </select>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Project'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}