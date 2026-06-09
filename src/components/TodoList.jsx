import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth.js';

const SEED_TASKS = [
  {
    id: 'seed_1',
    title: 'Switch to public transport for 1 week',
    category: 'transport',
    categoryEmoji: '🚌',
    savingKg: 14.7,
    status: 'pending',
    assignee: '',
    note: 'Use metro, bus, or auto-rickshaw instead of personal vehicle.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'seed_2',
    title: 'Reduce AC usage by 2 hours daily',
    category: 'energy',
    categoryEmoji: '❄️',
    savingKg: 6.4,
    status: 'pending',
    assignee: '',
    note: 'Set AC to 24°C and use ceiling fans as supplement.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'seed_3',
    title: 'Go vegetarian for 5 days',
    category: 'food',
    categoryEmoji: '🥗',
    savingKg: 8.5,
    status: 'pending',
    assignee: '',
    note: 'Replace meat meals with dal, sabzi, or paneer dishes.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'seed_4',
    title: 'Switch to LED bulbs in all rooms',
    category: 'energy',
    categoryEmoji: '💡',
    savingKg: 12.0,
    status: 'pending',
    assignee: '',
    note: 'LEDs use 75% less energy than incandescent bulbs.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'seed_5',
    title: 'Avoid single-use plastic for 1 month',
    category: 'waste',
    categoryEmoji: '♻️',
    savingKg: 3.6,
    status: 'pending',
    assignee: '',
    note: 'Carry a cloth bag and reusable water bottle.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'seed_6',
    title: 'Install solar water heater',
    category: 'energy',
    categoryEmoji: '☀️',
    savingKg: 400.0,
    status: 'pending',
    assignee: '',
    note: 'MNRE subsidy available — saves 300-500 kg CO₂/year.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'seed_7',
    title: 'Buy seasonal & local produce for 1 month',
    category: 'food',
    categoryEmoji: '🛒',
    savingKg: 5.2,
    status: 'pending',
    assignee: '',
    note: 'Local produce skips long transport chains, cutting food miles.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'seed_8',
    title: 'Plant 3 trees in your neighbourhood',
    category: 'nature',
    categoryEmoji: '🌳',
    savingKg: 63.0,
    status: 'pending',
    assignee: '',
    note: 'Each tree absorbs ~21 kg CO₂/year over its lifetime.',
    createdAt: new Date().toISOString(),
  },
];

const STATUS_CONFIG = {
  pending: { label: 'To-Do', color: '#6b7280', bg: 'rgba(107,114,128,0.15)', emoji: '⏳' },
  'in-progress': { label: 'In Progress', color: '#fbbf24', bg: 'rgba(251,191,36,0.15)', emoji: '🔄' },
  done: { label: 'Done', color: '#34d399', bg: 'rgba(52,211,153,0.15)', emoji: '✅' },
};

const CATEGORY_COLORS = {
  transport: '#60a5fa',
  food: '#34d399',
  energy: '#fbbf24',
  waste: '#f87171',
  nature: '#86efac',
  other: '#a78bfa',
};

function storageKey(uid) {
  return `ecosense_todo_${uid}`;
}

export default function TodoList() {
  const { user } = useAuth();
  const uid = user?.uid || 'guest';
  const defaultAssignee = user?.displayName || user?.email?.split('@')[0] || '';

  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey(uid));
      if (saved) return JSON.parse(saved);
    } catch { /* ignore */ }
    return SEED_TASKS.map(t => ({ ...t, assignee: defaultAssignee }));
  });

  const [filter, setFilter] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    category: 'other',
    savingKg: '',
    note: '',
    assignee: defaultAssignee,
  });
  const [editId, setEditId] = useState(null);

  // Persist whenever tasks or uid changes
  useEffect(() => {
    try {
      localStorage.setItem(storageKey(uid), JSON.stringify(tasks));
    } catch { /* ignore */ }
  }, [tasks, uid]);

  // Reload tasks when user switches
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey(uid));
      if (saved) {
        setTasks(JSON.parse(saved));
      } else {
        setTasks(SEED_TASKS.map(t => ({ ...t, assignee: defaultAssignee })));
      }
    } catch { /* ignore */ }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uid]);

  const cycleStatus = (id) => {
    const order = ['pending', 'in-progress', 'done'];
    setTasks(prev => prev.map(t =>
      t.id === id
        ? { ...t, status: order[(order.indexOf(t.status) + 1) % order.length] }
        : t
    ));
  };

  const deleteTask = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const addTask = (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;
    const task = {
      id: `task_${Date.now()}`,
      title: newTask.title.trim(),
      category: newTask.category,
      categoryEmoji: getCategoryEmoji(newTask.category),
      savingKg: parseFloat(newTask.savingKg) || 0,
      note: newTask.note.trim(),
      assignee: newTask.assignee.trim() || defaultAssignee,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setTasks(prev => [task, ...prev]);
    setNewTask({ title: '', category: 'other', savingKg: '', note: '', assignee: defaultAssignee });
    setShowAddForm(false);
  };

  const updateAssignee = (id, val) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, assignee: val } : t));
    setEditId(null);
  };

  function getCategoryEmoji(cat) {
    const map = { transport: '🚌', food: '🥗', energy: '⚡', waste: '♻️', nature: '🌳', other: '📋' };
    return map[cat] || '📋';
  }

  const filtered = filter === 'all' ? tasks : tasks.filter(t => t.status === filter);
  const stats = {
    total: tasks.length,
    done: tasks.filter(t => t.status === 'done').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    savedKg: tasks.filter(t => t.status === 'done').reduce((s, t) => s + t.savingKg, 0),
  };

  return (
    <section className="todo-section" aria-label="Carbon Reduction To-Do List">
      <div className="section-header">
        <h2 className="section-title">✅ Carbon-Reduction Tasks</h2>
        <p className="section-desc">
          Track actions to cut your carbon footprint. Assign tasks, mark progress, and watch your CO₂ savings grow.
        </p>
      </div>

      {/* Stats Bar */}
      <div className="todo-stats">
        <div className="todo-stat-card">
          <span className="todo-stat-value">{stats.total}</span>
          <span className="todo-stat-label">Total Tasks</span>
        </div>
        <div className="todo-stat-card todo-stat-card--progress">
          <span className="todo-stat-value">{stats.inProgress}</span>
          <span className="todo-stat-label">In Progress</span>
        </div>
        <div className="todo-stat-card todo-stat-card--done">
          <span className="todo-stat-value">{stats.done}</span>
          <span className="todo-stat-label">Completed</span>
        </div>
        <div className="todo-stat-card todo-stat-card--saved">
          <span className="todo-stat-value">{stats.savedKg.toFixed(1)}</span>
          <span className="todo-stat-label">kg CO₂ Saved</span>
        </div>
      </div>

      {/* Filter row + Add button */}
      <div className="todo-toolbar">
        <div className="todo-filters" role="group" aria-label="Filter tasks">
          {['all', 'pending', 'in-progress', 'done'].map(f => (
            <button
              key={f}
              className={`todo-filter-btn ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f === 'all' ? '🗂 All' : `${STATUS_CONFIG[f]?.emoji} ${STATUS_CONFIG[f]?.label}`}
            </button>
          ))}
        </div>
        <button
          id="add-task-btn"
          className="btn btn-primary btn-sm"
          onClick={() => setShowAddForm(v => !v)}
        >
          {showAddForm ? '✕ Cancel' : '➕ Add Task'}
        </button>
      </div>

      {/* Add Task Form */}
      {showAddForm && (
        <form className="todo-add-form" onSubmit={addTask} aria-label="Add new task">
          <h3 className="todo-add-title">New Carbon-Reduction Task</h3>
          <div className="todo-add-grid">
            <div className="form-group">
              <label className="form-label" htmlFor="task-title">Task Title *</label>
              <input
                id="task-title"
                type="text"
                className="form-input"
                placeholder="e.g. Switch to public transport for a week"
                value={newTask.title}
                onChange={e => setNewTask(p => ({ ...p, title: e.target.value }))}
                required
                maxLength={120}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="task-assignee">Assign To</label>
              <input
                id="task-assignee"
                type="text"
                className="form-input"
                placeholder="Your name"
                value={newTask.assignee}
                onChange={e => setNewTask(p => ({ ...p, assignee: e.target.value }))}
                maxLength={60}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="task-category">Category</label>
              <select
                id="task-category"
                className="form-select"
                value={newTask.category}
                onChange={e => setNewTask(p => ({ ...p, category: e.target.value }))}
              >
                <option value="transport">🚌 Transport</option>
                <option value="food">🥗 Food</option>
                <option value="energy">⚡ Energy</option>
                <option value="waste">♻️ Waste</option>
                <option value="nature">🌳 Nature</option>
                <option value="other">📋 Other</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="task-saving">Estimated CO₂ Saving (kg)</label>
              <input
                id="task-saving"
                type="number"
                className="form-input"
                placeholder="e.g. 5.5"
                value={newTask.savingKg}
                onChange={e => setNewTask(p => ({ ...p, savingKg: e.target.value }))}
                min="0"
                step="0.1"
              />
            </div>
            <div className="form-group todo-add-note">
              <label className="form-label" htmlFor="task-note">Note (optional)</label>
              <input
                id="task-note"
                type="text"
                className="form-input"
                placeholder="Any extra details…"
                value={newTask.note}
                onChange={e => setNewTask(p => ({ ...p, note: e.target.value }))}
                maxLength={200}
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary btn-sm" disabled={!newTask.title.trim()}>
            ➕ Add Task
          </button>
        </form>
      )}

      {/* Task List */}
      <div className="todo-list" role="list">
        {filtered.length === 0 && (
          <div className="empty-state">
            <p>No tasks here yet. {filter !== 'all' ? 'Try a different filter or ' : ''}Add one above! 🌱</p>
          </div>
        )}
        {filtered.map(task => {
          const sc = STATUS_CONFIG[task.status];
          const catColor = CATEGORY_COLORS[task.category] || CATEGORY_COLORS.other;
          return (
            <div
              key={task.id}
              className={`todo-card ${task.status === 'done' ? 'todo-card--done' : ''}`}
              role="listitem"
            >
              {/* Left accent bar */}
              <div className="todo-card-accent" style={{ background: catColor }} />

              <div className="todo-card-body">
                {/* Top row: title + status badge */}
                <div className="todo-card-top">
                  <div className="todo-card-title-row">
                    <span className="todo-cat-emoji" aria-hidden="true">{task.categoryEmoji}</span>
                    <h3 className={`todo-card-title ${task.status === 'done' ? 'todo-card-title--done' : ''}`}>
                      {task.title}
                    </h3>
                  </div>
                  <button
                    className="todo-status-badge"
                    style={{ color: sc.color, background: sc.bg }}
                    onClick={() => cycleStatus(task.id)}
                    title="Click to change status"
                    aria-label={`Status: ${sc.label}. Click to cycle.`}
                  >
                    {sc.emoji} {sc.label}
                  </button>
                </div>

                {/* Note */}
                {task.note && <p className="todo-card-note">{task.note}</p>}

                {/* Bottom row: assignee + saving + delete */}
                <div className="todo-card-footer">
                  <div className="todo-assignee-wrapper">
                    {editId === task.id ? (
                      <input
                        className="todo-assignee-input"
                        defaultValue={task.assignee}
                        autoFocus
                        onBlur={e => updateAssignee(task.id, e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && updateAssignee(task.id, e.target.value)}
                        maxLength={60}
                        aria-label="Edit assignee"
                      />
                    ) : (
                      <button
                        className="todo-assignee-chip"
                        onClick={() => setEditId(task.id)}
                        title="Click to edit assignee"
                        aria-label={`Assigned to ${task.assignee || 'unassigned'}. Click to edit.`}
                      >
                        👤 {task.assignee || 'Unassigned'}
                      </button>
                    )}
                  </div>
                  {task.savingKg > 0 && (
                    <span className="todo-saving-chip">
                      🌱 {task.savingKg >= 1 ? `${task.savingKg.toFixed(1)} kg` : `${(task.savingKg * 1000).toFixed(0)} g`} CO₂ saved
                    </span>
                  )}
                  <button
                    className="todo-delete-btn"
                    onClick={() => deleteTask(task.id)}
                    aria-label={`Delete task: ${task.title}`}
                    title="Delete task"
                  >
                    🗑
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
