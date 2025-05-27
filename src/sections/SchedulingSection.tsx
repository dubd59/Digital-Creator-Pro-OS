import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { 
  Calendar as CalendarIcon, 
  Plus, 
  ListTodo, 
  Clock, 
  ChevronLeft, 
  ChevronRight,
  X,
  Edit,
  Trash2
} from 'lucide-react';

interface Task {
  id: number;
  title: string;
  date: string;
  time: string;
  category: string;
  completed: boolean;
}

export const SchedulingSection: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeView, setActiveView] = useState<'calendar' | 'tasks'>('calendar');
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newTask, setNewTask] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    category: 'work'
  });
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: 'Client Meeting', date: '2025-03-20', time: '10:00', category: 'work', completed: false },
    { id: 2, title: 'Content Creation', date: '2025-03-20', time: '13:00', category: 'content', completed: true },
    { id: 3, title: 'Email Newsletter', date: '2025-03-20', time: '15:30', category: 'marketing', completed: false },
    { id: 4, title: 'Social Media Post', date: '2025-03-20', time: '17:00', category: 'social', completed: false },
  ]);

  const handleAddTask = () => {
    const newTaskObj: Task = {
      id: Date.now(),
      title: newTask.title,
      date: newTask.date,
      time: newTask.time,
      category: newTask.category,
      completed: false
    };

    setTasks([...tasks, newTaskObj]);
    setIsNewTaskModalOpen(false);
    setNewTask({
      title: '',
      date: new Date().toISOString().split('T')[0],
      time: '09:00',
      category: 'work'
    });
  };

  const handleEditTask = () => {
    if (!editingTask) return;

    setTasks(tasks.map(task => 
      task.id === editingTask.id ? editingTask : task
    ));
    setIsEditTaskModalOpen(false);
    setEditingTask(null);
  };

  const handleDeleteTask = (taskId: number) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const handleDateClick = (date: Date) => {
    const formattedDate = date.toISOString().split('T')[0];
    setNewTask({
      ...newTask,
      date: formattedDate,
      title: '',
      time: '09:00',
      category: 'work'
    });
    setIsNewTaskModalOpen(true);
  };

  const getTasksForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return tasks.filter(task => task.date === dateStr);
  };

  const daysInMonth = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth() + 1,
    0
  ).getDate();
  
  const firstDayOfMonth = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth(),
    1
  ).getDay();
  
  const previousMonthDays = [];
  const currentMonthDays = [];
  const nextMonthDays = [];
  
  // Previous month days that appear in the calendar
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    const day = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      -i
    );
    previousMonthDays.push({
      date: day,
      isCurrentMonth: false,
    });
  }
  
  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    const day = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      i
    );
    currentMonthDays.push({
      date: day,
      isCurrentMonth: true,
      isToday:
        day.getDate() === new Date().getDate() &&
        day.getMonth() === new Date().getMonth() &&
        day.getFullYear() === new Date().getFullYear(),
    });
  }
  
  // Calculate how many next month days to show to complete the grid
  const totalShownDays = previousMonthDays.length + currentMonthDays.length;
  const nextMonthDaysToShow = totalShownDays > 35 ? 42 - totalShownDays : 35 - totalShownDays;
  
  // Next month days that appear in the calendar
  for (let i = 1; i <= nextMonthDaysToShow; i++) {
    const day = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth() + 1,
      i
    );
    nextMonthDays.push({
      date: day,
      isCurrentMonth: false,
    });
  }
  
  const allDays = [...previousMonthDays, ...currentMonthDays, ...nextMonthDays];
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const changeMonth = (increment: number) => {
    setSelectedDate(new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth() + increment,
      1
    ));
  };
  
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-2xl font-bold">Scheduling</h1>
        <div className="flex mt-4 sm:mt-0 space-x-2">
          <Button 
            variant={activeView === 'calendar' ? 'primary' : 'outline'} 
            size="sm"
            icon={<CalendarIcon size={16} />}
            onClick={() => setActiveView('calendar')}
          >
            Calendar
          </Button>
          <Button 
            variant={activeView === 'tasks' ? 'primary' : 'outline'} 
            size="sm"
            icon={<ListTodo size={16} />}
            onClick={() => setActiveView('tasks')}
          >
            Tasks
          </Button>
          <Button 
            variant="primary" 
            size="sm"
            icon={<Plus size={16} />}
            onClick={() => {
              setNewTask({
                ...newTask,
                date: new Date().toISOString().split('T')[0]
              });
              setIsNewTaskModalOpen(true);
            }}
          >
            New Task
          </Button>
        </div>
      </div>

      {/* New Task Modal */}
      <Modal isOpen={isNewTaskModalOpen} onClose={() => setIsNewTaskModalOpen(false)}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Add New Task</h2>
            <button 
              onClick={() => setIsNewTaskModalOpen(false)}
              className="text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Task Title
              </label>
              <input
                type="text"
                className="w-full p-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                placeholder="Enter task title"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Date
              </label>
              <input
                type="date"
                className="w-full p-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800"
                value={newTask.date}
                onChange={(e) => setNewTask({ ...newTask, date: e.target.value })}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Time
              </label>
              <input
                type="time"
                className="w-full p-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800"
                value={newTask.time}
                onChange={(e) => setNewTask({ ...newTask, time: e.target.value })}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Category
              </label>
              <select
                className="w-full p-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800"
                value={newTask.category}
                onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
              >
                <option value="work">Work</option>
                <option value="content">Content</option>
                <option value="marketing">Marketing</option>
                <option value="social">Social</option>
              </select>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end space-x-2">
            <Button 
              variant="outline" 
              onClick={() => setIsNewTaskModalOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="primary"
              onClick={handleAddTask}
              disabled={!newTask.title.trim()}
            >
              Add Task
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Task Modal */}
      <Modal isOpen={isEditTaskModalOpen} onClose={() => setIsEditTaskModalOpen(false)}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Edit Task</h2>
            <button 
              onClick={() => setIsEditTaskModalOpen(false)}
              className="text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
            >
              <X size={20} />
            </button>
          </div>
          
          {editingTask && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Task Title
                </label>
                <input
                  type="text"
                  className="w-full p-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800"
                  value={editingTask.title}
                  onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                  placeholder="Enter task title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  className="w-full p-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800"
                  value={editingTask.date}
                  onChange={(e) => setEditingTask({ ...editingTask, date: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Time
                </label>
                <input
                  type="time"
                  className="w-full p-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800"
                  value={editingTask.time}
                  onChange={(e) => setEditingTask({ ...editingTask, time: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Category
                </label>
                <select
                  className="w-full p-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800"
                  value={editingTask.category}
                  onChange={(e) => setEditingTask({ ...editingTask, category: e.target.value })}
                >
                  <option value="work">Work</option>
                  <option value="content">Content</option>
                  <option value="marketing">Marketing</option>
                  <option value="social">Social</option>
                </select>
              </div>
            </div>
          )}
          
          <div className="mt-6 flex justify-end space-x-2">
            <Button 
              variant="outline" 
              onClick={() => setIsEditTaskModalOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="primary"
              onClick={handleEditTask}
              disabled={!editingTask?.title.trim()}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>

      {activeView === 'calendar' ? (
        <Card>
          <CardHeader className="pb-0">
            <div className="flex justify-between items-center">
              <CardTitle>
                {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}
              </CardTitle>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => changeMonth(-1)}
                  icon={<ChevronLeft size={16} />}
                >
                  Previous
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => changeMonth(1)}
                  icon={<ChevronRight size={16} />}
                >
                  Next
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-7 gap-1">
              {weekDays.map(day => (
                <div key={day} className="text-center font-medium text-sm py-2 text-neutral-500">
                  {day}
                </div>
              ))}
              
              {allDays.map((day, index) => {
                const isToday = day.date.getDate() === new Date().getDate() &&
                              day.date.getMonth() === new Date().getMonth() &&
                              day.date.getFullYear() === new Date().getFullYear();
                
                const dayTasks = getTasksForDate(day.date);
                
                return (
                  <div 
                    key={index}
                    onClick={() => handleDateClick(day.date)}
                    className={`relative h-24 p-1 border rounded-lg transition-all ${
                      day.isCurrentMonth 
                        ? 'bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700' 
                        : 'bg-neutral-50 dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800 text-neutral-400'
                    } ${
                      isToday 
                        ? 'ring-2 ring-primary-400 border-primary-400' 
                        : ''
                    } hover:border-primary-400 cursor-pointer`}
                  >
                    <div className="text-right p-1">
                      <span className={`text-sm ${isToday ? 'font-bold text-primary-400' : ''}`}>
                        {day.date.getDate()}
                      </span>
                    </div>
                    
                    <div className="absolute bottom-1 left-1 right-1">
                      {dayTasks.slice(0, 2).map((task, i) => (
                        <div 
                          key={task.id}
                          className={`text-xs p-1 mb-1 rounded truncate ${
                            task.category === 'work' ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300' :
                            task.category === 'content' ? 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300' :
                            task.category === 'marketing' ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300' :
                            'bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-300'
                          }`}
                        >
                          {task.title}
                        </div>
                      ))}
                      {dayTasks.length > 2 && (
                        <div className="text-xs text-neutral-500 dark:text-neutral-400">
                          +{dayTasks.length - 2} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Today's Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {tasks.map(task => (
                  <div 
                    key={task.id} 
                    className={`flex items-center p-3 border rounded-lg ${
                      task.completed 
                        ? 'bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700' 
                        : 'bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700'
                    }`}
                  >
                    <input 
                      type="checkbox" 
                      checked={task.completed}
                      onChange={() => {
                        setTasks(tasks.map(t => 
                          t.id === task.id ? { ...t, completed: !t.completed } : t
                        ));
                      }}
                      className="h-5 w-5 rounded border-neutral-300 text-primary-400 focus:ring-primary-400/50"
                    />
                    <div className="ml-3 flex-1">
                      <p className={`font-medium ${task.completed ? 'line-through text-neutral-400' : ''}`}>
                        {task.title}
                      </p>
                      <div className="flex items-center mt-1">
                        <Clock size={14} className="text-neutral-400 mr-1" />
                        <span className="text-xs text-neutral-500">{task.time}</span>
                        <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                          task.category === 'work' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300' :
                          task.category === 'content' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300' :
                          task.category === 'marketing' ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300' :
                          'bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300'
                        }`}>
                          {task.category}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          setEditingTask(task);
                          setIsEditTaskModalOpen(true);
                        }}
                        icon={<Edit size={14} />}
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteTask(task.id)}
                        icon={<Trash2 size={14} />}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[...tasks].reverse().map(task => (
                  <div 
                    key={`upcoming-${task.id}`} 
                    className="flex items-center p-3 border rounded-lg bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700"
                  >
                    <input 
                      type="checkbox" 
                      className="h-5 w-5 rounded border-neutral-300 text-primary-400 focus:ring-primary-400/50"
                    />
                    <div className="ml-3 flex-1">
                      <p className="font-medium">{task.title}</p>
                      <div className="flex items-center mt-1">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-300">
                          Tomorrow
                        </span>
                        <Clock size={14} className="text-neutral-400 ml-2 mr-1" />
                        <span className="text-xs text-neutral-500">{task.time}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          setEditingTask(task);
                          setIsEditTaskModalOpen(true);
                        }}
                        icon={<Edit size={14} />}
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteTask(task.id)}
                        icon={<Trash2 size={14} />}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};