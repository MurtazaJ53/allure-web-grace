
import { useState } from 'react';
import { Plus, Check, Trash2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  priority: 'low' | 'medium' | 'high';
}

interface TaskManagerProps {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
}

export const TaskManager = ({ tasks, setTasks }: TaskManagerProps) => {
  const [newTask, setNewTask] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');

  const addTask = () => {
    if (newTask.trim()) {
      const task: Task = {
        id: Date.now().toString(),
        text: newTask.trim(),
        completed: false,
        createdAt: new Date(),
        priority
      };
      setTasks([task, ...tasks]);
      setNewTask('');
    }
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const pendingTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  return (
    <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Clock className="w-6 h-6 text-blue-600" />
          Tasks
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add Task Form */}
        <div className="flex gap-2">
          <Input
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="What needs to be done?"
            onKeyPress={(e) => e.key === 'Enter' && addTask()}
            className="flex-1"
          />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <Button onClick={addTask} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {/* Pending Tasks */}
        {pendingTasks.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-700">Pending ({pendingTasks.length})</h3>
            {pendingTasks.map(task => (
              <div key={task.id} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all">
                <button
                  onClick={() => toggleTask(task.id)}
                  className="w-5 h-5 border-2 border-gray-300 rounded hover:border-blue-500 flex items-center justify-center transition-colors"
                >
                </button>
                <span className="flex-1 text-gray-800">{task.text}</span>
                <Badge className={getPriorityColor(task.priority)}>
                  {task.priority}
                </Badge>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Completed Tasks */}
        {completedTasks.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-700">Completed ({completedTasks.length})</h3>
            {completedTasks.map(task => (
              <div key={task.id} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200 opacity-75">
                <button
                  onClick={() => toggleTask(task.id)}
                  className="w-5 h-5 bg-green-500 rounded flex items-center justify-center"
                >
                  <Check className="w-3 h-3 text-white" />
                </button>
                <span className="flex-1 text-gray-600 line-through">{task.text}</span>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {tasks.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No tasks yet. Add one above to get started!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
