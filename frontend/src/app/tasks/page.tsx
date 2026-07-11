'use client';

import { useEffect, useState } from 'react';
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
  const [editingTask, setEditingTask] = useState<Task | null>(null);
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
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">Tasks</h1>
            <p className="mt-3 text-base text-gray-600">Manage project tasks, priorities and due dates.</p>
          </div>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex h-11 items-center gap-2 justify-center rounded-lg bg-blue-600 px-6 text-sm font-semibold text-white shadow-md transition-colors hover:bg-blue-700"
            >
              + New Task
            </button>
          )}
        </div>

        {showForm && (
          <div className="mb-10 rounded-xl border border-gray-200 bg-gray-50 p-8 shadow-sm">
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
        {editingTask && (
          <div className="mb-10 rounded-xl border border-gray-200 bg-gray-50 p-8 shadow-sm">
            <TaskForm
              initialData={editingTask}
              teamMembers={[]}
              onSuccess={() => {
                setEditingTask(null);
                fetchTasks();
              }}
              onCancel={() => setEditingTask(null)}
            />
          </div>
        )}

        <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <TaskFilterBar
            onStatusChange={handleStatusChange}
            onPriorityChange={handlePriorityChange}
            selectedStatus={statusFilter}
            selectedPriority={priorityFilter}
          />
        </div>

        {filteredTasks.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-12 text-center shadow-sm">
            <div className="mb-3 text-2xl" aria-hidden="true">✓</div>
            <p className="text-base font-medium text-gray-900">
              {tasks.length === 0
                ? 'No tasks yet. Create your first task!'
                : 'No tasks match the selected filters.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            {filteredTasks.map((task) => (
              <div key={task.id} className="rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-lg">
                <div className="p-10">
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold text-gray-900">{task.title}</h3>
                      <p className="mt-2 text-base font-medium text-gray-500">
                        {task.project?.name || 'No project assigned'}
                      </p>
                      {task.description && (
                        <p className="mt-4 line-clamp-2 text-base text-gray-600">{task.description}</p>
                      )}
                      <div className="mt-6 flex flex-wrap gap-3">
                        <div className="flex items-center gap-2">
                          <div
                            className={`h-2.5 w-2.5 rounded-full ${
                              task.status === 'Done'
                                ? 'bg-green-500'
                                : task.status === 'In Progress'
                                  ? 'bg-blue-500'
                                  : 'bg-gray-400'
                            }`}
                          />
                          <span
                            className={`text-sm font-semibold ${
                              task.status === 'Done'
                                ? 'text-green-700'
                                : task.status === 'In Progress'
                                  ? 'text-blue-700'
                                  : 'text-gray-700'
                            }`}
                          >
                            {task.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div
                            className={`h-2.5 w-2.5 rounded-full ${
                              task.priority === 'High'
                                ? 'bg-red-500'
                                : task.priority === 'Medium'
                                  ? 'bg-yellow-500'
                                  : 'bg-green-500'
                            }`}
                          />
                          <span
                            className={`text-sm font-semibold ${
                              task.priority === 'High'
                                ? 'text-red-700'
                                : task.priority === 'Medium'
                                  ? 'text-yellow-700'
                                  : 'text-green-700'
                            }`}
                          >
                            {task.priority} Priority
                          </span>
                        </div>
                      </div>
                      <div className="mt-5 flex flex-wrap gap-5 text-base text-gray-500">
                        {task.dueDate && (
                          <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                        )}
                        {task.assignee && (
                          <span>Assigned to: {task.assignee.name}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 bg-gray-50/50 px-10 py-5 flex justify-end gap-4">
                  <button
                    onClick={() => setEditingTask(task)}
                    className="inline-flex h-11 items-center gap-2 justify-center rounded-lg border-2 border-amber-200 bg-white px-6 text-sm font-semibold text-amber-600 transition-colors hover:bg-amber-50"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="inline-flex h-11 items-center gap-2 justify-center rounded-lg border-2 border-red-200 bg-white px-6 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
