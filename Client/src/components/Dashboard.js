import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { CheckCircle, Clock, AlertTriangle, Calendar } from 'lucide-react';

import Badge from './ui/Badge';
import LoadingSpinner from './ui/LoadingSpinner';
import taskStore from '../stores/TaskStore';

const Dashboard = observer(() => {
  useEffect(() => {
    taskStore.loadTasks();
  }, []);

  const stats = {
    total: taskStore.tasks.length,
    overdue: taskStore.overdueTasks.length,
    completed: taskStore.tasks.filter(task => task.isCompleted).length,
    pending: taskStore.tasks.filter(task => !task.isCompleted && taskStore.getTaskStatus(task) === 'Pending').length
  };

  const StatCard = ({ title, value, icon: Icon, color, bgColor }) => (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center">
        <div className={`${bgColor} rounded-lg p-3`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );

  const PrioritySection = ({ priority, tasks, variant }) => (
    <div className="bg-white rounded-lg shadow-sm border p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-medium text-gray-900">{priority} Priority</h3>
        <Badge variant={variant}>{tasks.length}</Badge>
      </div>
      {tasks.length === 0 ? (
        <p className="text-gray-500 text-sm">No {priority.toLowerCase()} priority tasks</p>
      ) : (
        <div className="space-y-2">
          {tasks.slice(0, 3).map((task) => (
            <div key={task.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <span className="text-sm text-gray-900 truncate">{task.title}</span>
              <Badge variant={taskStore.getTaskStatus(task) === 'Overdue' ? 'danger' : 'default'} size="sm">
                {taskStore.getTaskStatus(task)}
              </Badge>
            </div>
          ))}
          {tasks.length > 3 && (
            <p className="text-xs text-gray-500">+{tasks.length - 3} more tasks</p>
          )}
        </div>
      )}
    </div>
  );

  if (taskStore.loading && taskStore.tasks.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Overview of your task management system</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Tasks"
          value={stats.total}
          icon={Calendar}
          color="text-blue-600"
          bgColor="bg-blue-100"
        />
        <StatCard
          title="Pending Tasks"
          value={stats.pending}
          icon={Clock}
          color="text-yellow-600"
          bgColor="bg-yellow-100"
        />
        <StatCard
          title="Overdue Tasks"
          value={stats.overdue}
          icon={AlertTriangle}
          color="text-red-600"
          bgColor="bg-red-100"
        />
        <StatCard
          title="Completed Tasks"
          value={stats.completed}
          icon={CheckCircle}
          color="text-green-600"
          bgColor="bg-green-100"
        />
      </div>

      {/* Error Message */}
      {taskStore.error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">{taskStore.error}</p>
        </div>
      )}

      {/* Priority Breakdown */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Tasks by Priority</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <PrioritySection
            priority="Critical"
            tasks={taskStore.tasksByPriority.Critical}
            variant="critical"
          />
          <PrioritySection
            priority="High"
            tasks={taskStore.tasksByPriority.High}
            variant="danger"
          />
          <PrioritySection
            priority="Medium"
            tasks={taskStore.tasksByPriority.Medium}
            variant="warning"
          />
          <PrioritySection
            priority="Low"
            tasks={taskStore.tasksByPriority.Low}
            variant="success"
          />
        </div>
      </div>

      {/* Recent Overdue Tasks */}
      {taskStore.overdueTasks.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Overdue Tasks</h2>
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-4 border-b">
              <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
                <span className="font-medium text-red-900">
                  {taskStore.overdueTasks.length} task{taskStore.overdueTasks.length !== 1 ? 's' : ''} overdue
                </span>
              </div>
            </div>
            <div className="divide-y">
              {taskStore.overdueTasks.slice(0, 5).map((task) => (
                <div key={task.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">{task.title}</h4>
                      <p className="text-sm text-gray-600">{task.fullName}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="danger" size="sm">Overdue</Badge>
                      <p className="text-xs text-gray-500 mt-1">
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default Dashboard;