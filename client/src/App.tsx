import React, { useState, useEffect } from 'react';
import { Todo, TodoCategory } from './types';
import { api } from './api';
import CustomDropdown from './CustomDropdown';
import './App.css';

type TabType = 'All' | TodoCategory;

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoText, setNewTodoText] = useState('');
  const [newTodoCategory, setNewTodoCategory] = useState<TodoCategory>('Я должен');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const [editingCategory, setEditingCategory] = useState<TodoCategory>('Я должен');
  const [activeTab, setActiveTab] = useState<TabType>('All');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const fetchedTodos = await api.getTodos();
      setTodos(fetchedTodos);
      setError(null);
    } catch (err) {
      setError('Failed to fetch todos');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoText.trim()) return;

    try {
      const newTodo = await api.createTodo(newTodoText, newTodoCategory);
      setTodos([...todos, newTodo]);
      setNewTodoText('');
      setNewTodoCategory('Я должен');
      setError(null);
    } catch (err) {
      setError('Failed to add todo');
    }
  };

  const handleToggleTodo = async (id: string, completed: boolean) => {
    try {
      const updatedTodo = await api.updateTodo(id, { completed });
      setTodos(todos.map(todo => 
        todo.id === id ? updatedTodo : todo
      ));
      setError(null);
    } catch (err) {
      setError('Failed to update todo');
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      await api.deleteTodo(id);
      setTodos(todos.filter(todo => todo.id !== id));
      setError(null);
    } catch (err) {
      setError('Failed to delete todo');
    }
  };

  const handleStartEdit = (id: string, text: string, category: TodoCategory) => {
    setEditingId(id);
    setEditingText(text);
    setEditingCategory(category);
  };

  const handleSaveEdit = async () => {
    if (!editingId || !editingText.trim()) return;

    try {
      const updatedTodo = await api.updateTodo(editingId, { text: editingText, category: editingCategory });
      setTodos(todos.map(todo => 
        todo.id === editingId ? updatedTodo : todo
      ));
      setEditingId(null);
      setEditingText('');
      setEditingCategory('Я должен');
      setError(null);
    } catch (err) {
      setError('Failed to update todo');
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingText('');
    setEditingCategory('Я должен');
  };

  const categories: TodoCategory[] = ['Я должен', 'Мне должны', 'Miscellaneous'];
  const tabs: TabType[] = ['All', ...categories];
  
  const filteredTodos = activeTab === 'All' ? todos : todos.filter(todo => todo.category === activeTab);
  
  const getCategoryBadgeColor = (category: TodoCategory): string => {
    switch (category) {
      case 'Я должен':
        return '#e74c3c';
      case 'Мне должны':
        return '#3498db';
      case 'Miscellaneous':
        return '#95a5a6';
      default:
        return '#95a5a6';
    }
  };

  const getCategoryEmoji = (category: TodoCategory): string => {
    switch (category) {
      case 'Я должен':
        return '📝';
      case 'Мне должны':
        return '💰';
      case 'Miscellaneous':
        return '📋';
      default:
        return '📋';
    }
  };

  const getCategoryWithEmoji = (category: TodoCategory): string => {
    return `${getCategoryEmoji(category)} ${category}`;
  };

  if (loading) {
    return (
      <div className="app">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="app">
      <h1 className="app-title">KK</h1>

      {error && <div className="error">{error}</div>}

      <form onSubmit={handleAddTodo} className="add-todo-form">
        <input
          type="text"
          value={newTodoText}
          onChange={(e) => setNewTodoText(e.target.value)}
          placeholder="Add a new todo..."
          className="add-todo-input"
        />
        <CustomDropdown
          value={newTodoCategory}
          onChange={setNewTodoCategory}
          options={categories}
          className="category-dropdown"
          getOptionEmoji={getCategoryEmoji}
        />
        <button type="submit" className="add-todo-button">
          Add
        </button>
      </form>

      <div className="tabs-container">
        {tabs.map(tab => (
          <button
            key={tab}
            className={`tab-button ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
            {tab !== 'All' && (
              <span className="tab-count">
                {todos.filter(todo => todo.category === tab).length}
              </span>
            )}
            {tab === 'All' && (
              <span className="tab-count">
                {todos.length}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="tab-content">
        {filteredTodos.length === 0 ? (
          <div className="empty-state">
            <h3>No todos yet</h3>
            <p>Add your first todo above to get started!</p>
          </div>
        ) : (
          <ul className="todo-list">
            {filteredTodos.map((todo) => (
              <li key={todo.id} className="todo-item">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={(e) => handleToggleTodo(todo.id, e.target.checked)}
                  className="todo-checkbox"
                />
                
                {editingId === todo.id ? (
                  <>
                    <input
                      type="text"
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      className="edit-input"
                      autoFocus
                    />
                    <CustomDropdown
                      value={editingCategory}
                      onChange={setEditingCategory}
                      options={categories}
                      size="small"
                      className="category-dropdown-small"
                      getOptionEmoji={getCategoryEmoji}
                    />
                    <div className="edit-actions">
                      <button onClick={handleSaveEdit} className="save-button">
                        Save
                      </button>
                      <button onClick={handleCancelEdit} className="cancel-button">
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <span className={`todo-text ${todo.completed ? 'completed' : ''}`}>
                      {todo.text}
                    </span>
                    <span 
                      className="category-badge"
                      style={{ backgroundColor: getCategoryBadgeColor(todo.category) }}
                    >
                      {getCategoryEmoji(todo.category)} {todo.category}
                    </span>
                    <div className="todo-actions">
                      <button
                        onClick={() => handleStartEdit(todo.id, todo.text, todo.category)}
                        className="edit-button"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteTodo(todo.id)}
                        className="delete-button"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;