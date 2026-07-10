'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ClientForm } from '@/components/ClientForm';
import { clientsAPI } from '@/lib/api';
import { Client } from '@/lib/types';

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await clientsAPI.getAll();
      setClients(response.data);
    } catch (error) {
      console.error('Failed to fetch clients');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure?')) {
      try {
        await clientsAPI.delete(id);
        fetchClients();
      } catch (error) {
        alert('Failed to delete client');
      }
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">🏢 Clients</h1>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            + New Client
          </button>
        )}
      </div>

      {showForm && (
        <div className="mb-8">
          <ClientForm
            onSuccess={() => {
              setShowForm(false);
              fetchClients();
            }}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {clients.length === 0 ? (
        <div className="bg-white p-12 rounded-lg shadow text-center">
          <p className="text-gray-500 text-lg">No clients yet. Create your first client!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clients.map((client) => (
            <div key={client.id} className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-bold mb-2">{client.name}</h3>
              {client.email && <p className="text-sm text-gray-600">{client.email}</p>}
              {client.phone && <p className="text-sm text-gray-600">{client.phone}</p>}
              <div className="text-sm text-gray-500 mt-2">
                {client.projects?.length || 0} projects
              </div>
              <div className="flex gap-2 mt-4">
                <Link
                  href={`/clients/${client.id}`}
                  className="flex-1 bg-blue-600 text-white text-center px-3 py-2 rounded hover:bg-blue-700"
                >
                  View
                </Link>
                <button
                  onClick={() => handleDelete(client.id)}
                  className="flex-1 bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}