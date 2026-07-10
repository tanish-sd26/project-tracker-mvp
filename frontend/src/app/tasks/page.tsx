'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { TaskForm } from '@/components/TaskForm';
import { TaskFilterBar } from '@/components/TaskFilterBar';
import { tasksAPI } from '@/lib/api';
import { Task } from '@/lib/types';

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await tasksAPI.getAll();
      setTasks(response.data);
      applyFilters(response.data, statusFilter, priorityFilter);
    } catch (error) {
      console.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = (
    tasksToFilter: Task[],
    status: string,
    priority: string
  ) => {
    let filtered = tasksToFilter;

    if (status) {
      filtered = filtered.filter((t) => t.status === status);
    }

    if (priority) {
      filtered = filtered.filter((t) => t.priority === priority);
    }

    setFilteredTasks(filtered);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleStatusChange = (status: string) => {
    setStatusFilter(status);
    applyFilters(tasks, status, priorityFilter);
  };

  const handlePriorityChange = (priority: string) => {
    setPriorityFilter(priority);
    applyFilters(tasks, statusFilter, priority);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure?')) {
      try {
        await tasksAPI.delete(id);
        fetchTasks();
      } catch (error) {
        alert('Failed to delete task');
      }
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">✅ Tasks</h1>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            + New Task
          </button>
        )}
      </div>

      {showForm && (
        <div className="mb-8">
          <TaskForm
            teamMembers={[]}
            onSuccess={() => {
              setShowForm(false);
              fetchTasks();
            }}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      <TaskFilterBar
        onStatusChange={handleStatusChange}
        onPriorityChange={handlePriorityChange}
        selectedStatus={statusFilter}
        selectedPriority={priorityFilter}
      />

      {filteredTasks.length === 0 ? (
        <div className="bg-white p-12 rounded-lg shadow text-center">
          <p className="text-gray-500 text-lg">
            {tasks.length === 0
              ? 'No tasks yet. Create your first task!'
              : 'No tasks match the selected filters.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTasks.map((task) => (
            <div key={task.id} className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-2">{task.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">
                    Project: {task.project?.name}
                  </p>
                  {task.description && (
                    <p className="text-gray-600 text-sm mb-3">{task.description}</p>
                  )}
                  <div className="flex gap-2 mb-2">
                    <span
                      className={`px-3 py-1 text-xs rounded-full ${
                        task.status === 'Done'
                          ? 'bg-green-100 text-green-800'
                          : task.status === 'In Progress'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {task.status}
                    </span>
                    <span
                      className={`px-3 py-1 text-xs rounded-full ${
                        task.priority === 'High'
                          ? 'bg-red-100 text-red-800'
                          : task.priority === 'Medium'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {task.priority} Priority
                    </span>
                  </div>
                  {task.dueDate && (
                    <p className="text-sm text-gray-600">
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </p>
                  )}
                  {task.assignee && (
                    <p className="text-sm text-gray-600">
                      Assigned to: {task.assignee.name}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}