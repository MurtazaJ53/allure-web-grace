
import { useState, useMemo } from 'react';
import { Plus, Check, Trash2, Clock, Filter, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  priority: 'low' | 'medium' | 'high';
  category?: string;
  dueDate?: Date;
}

interface TaskManagerProps {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
}

export const TaskManager = ({ tasks, setTasks }: TaskManagerProps) => {
  const [newTask, setNewTask] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const addTask = () => {
    if (newTask.trim()) {
      const task: Task = {
        id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
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

  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case 'high': 
        return { 
          color: 'bg-red-100 text-red-800 border-red-200', 
          weight: 3,
          emoji: '🔥'
        };
      case 'medium': 
        return { 
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200', 
          weight: 2,
          emoji: '⚡'
        };
      case 'low': 
        return { 
          color: 'bg-green-100 text-green-800 border-green-200', 
          weight: 1,
          emoji: '🌱'
        };
      default: 
        return { 
          color: 'bg-gray-100 text-gray-800 border-gray-200', 
          weight: 0,
          emoji: '📝'
        };
    }
  };

  // Advanced filtering and sorting
  const filteredAndSortedTasks = useMemo(() => {
    let filtered = tasks;

    // Apply search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter(task =>
        task.text.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (filter === 'pending') {
      filtered = filtered.filter(task => !task.completed);
    } else if (filter === 'completed') {
      filtered = filtered.filter(task => task.completed);
    }

    // Sort by completion status, then priority, then creation date
    return filtered.sort((a, b) => {
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      
      const aPriority = getPriorityConfig(a.priority).weight;
      const bPriority = getPriorityConfig(b.priority).weight;
      
      if (aPriority !== bPriority) {
        return bPriority - aPriority;
      }
      
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [tasks, filter, searchTerm]);

  const pendingTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  return (
    <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl h-fit">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Clock className="w-6 h-6 text-blue-600" />
            Tasks
            <Badge variant="outline" className="ml-2">
              {pendingTasks.length} pending
            </Badge>
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Enhanced Add Task Form */}
        <div className="space-y-3">
          <div className="flex gap-2">
            <Input
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="What needs to be accomplished?"
              onKeyPress={(e) => e.key === 'Enter' && addTask()}
              className="flex-1 border-gray-300 focus:border-blue-500 transition-colors"
            />
            <Select value={priority} onValueChange={(value: 'low' | 'medium' | 'high') => setPriority(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high">🔥 High</SelectItem>
                <SelectItem value="medium">⚡ Medium</SelectItem>
                <SelectItem value="low">🌱 Low</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={addTask} className="bg-blue-600 hover:bg-blue-700 px-6">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Search and Filter */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search tasks..."
                className="pl-10 border-gray-300 focus:border-blue-500"
              />
            </div>
            <Select value={filter} onValueChange={(value: 'all' | 'pending' | 'completed') => setFilter(value)}>
              <SelectTrigger className="w-32">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Enhanced Tasks List */}
        {filteredAndSortedTasks.length > 0 ? (
          <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
            {filteredAndSortedTasks.map(task => {
              const priorityConfig = getPriorityConfig(task.priority);
              return (
                <div 
                  key={task.id} 
                  className={`group flex items-center gap-3 p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${
                    task.completed 
                      ? 'bg-green-50 border-green-200 opacity-75' 
                      : 'bg-white border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <button
                    onClick={() => toggleTask(task.id)}
                    className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                      task.completed 
                        ? 'bg-green-500 border-green-500 scale-110' 
                        : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
                    }`}
                  >
                    {task.completed && <Check className="w-4 h-4 text-white" />}
                  </button>
                  
                  <div className="flex-1 min-w-0">
                    <span className={`font-medium ${
                      task.completed 
                        ? 'text-gray-600 line-through' 
                        : 'text-gray-800'
                    }`}>
                      {task.text}
                    </span>
                    {task.completed && (
                      <span className="ml-2 text-xs text-green-600 font-medium">
                        ✓ Completed
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge className={priorityConfig.color}>
                      {priorityConfig.emoji} {task.priority}
                    </Badge>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 p-1 transition-all duration-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="font-medium">
              {searchTerm || filter !== 'all' 
                ? 'No tasks match your filters' 
                : 'No tasks yet. Add one above to get started!'
              }
            </p>
            {(searchTerm || filter !== 'all') && (
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('');
                  setFilter('all');
                }}
                className="mt-3"
              >
                Clear filters
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
