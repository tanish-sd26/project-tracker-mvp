'use client';

import { useState } from 'react';
import { clientsAPI } from '@/lib/api';

interface ClientFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  initialData?: any;
}

export function ClientForm({
  onSuccess,
  onCancel,
  initialData,
}: ClientFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('Client name is required');
      return;
    }

    setLoading(true);
    try {
      if (initialData) {
        await clientsAPI.update(initialData.id, formData);
      } else {
        await clientsAPI.create(formData);
      }
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to save client');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-2xl rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
      {error && <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      <div className="mb-5">
        <label className="mb-2 block text-sm font-medium text-gray-700">Client Name <span className="text-red-600">*</span></label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="h-11 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          placeholder="Enter client name"
        />
      </div>

      <div className="mb-5">
        <label className="mb-2 block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="h-11 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          placeholder="client@example.com"
        />
      </div>

      <div className="mb-6">
        <label className="mb-2 block text-sm font-medium text-gray-700">Phone</label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="h-11 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          placeholder="+91-1234567890"
        />
      </div>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="submit"
          disabled={loading}
          className="h-11 rounded-lg bg-blue-600 px-5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Client'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="h-11 rounded-lg border border-gray-300 bg-white px-5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
