const express = require('express');
const cors = require('cors');
const { createTodosTable, getAllTodos, createTodo, updateTodo, deleteTodo } = require('./db');

const app = express();
const PORT = process.env.PORT || 8765;

app.use(cors());
app.use(express.json());

// Initialize database
createTodosTable();

app.get('/api/todos', async (req, res) => {
  try {
    const todos = await getAllTodos();
    res.json(todos);
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/todos', async (req, res) => {
  const { text, category } = req.body;
  
  if (!text || text.trim() === '') {
    return res.status(400).json({ error: 'Todo text is required' });
  }
  
  const validCategories = ['Я должен', 'Мне должны', 'Miscellaneous'];
  if (!category || !validCategories.includes(category)) {
    return res.status(400).json({ error: 'Valid category is required' });
  }
  
  try {
    const newTodo = await createTodo(text.trim(), category);
    res.status(201).json(newTodo);
  } catch (error) {
    console.error('Error creating todo:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/todos/:id', async (req, res) => {
  const { id } = req.params;
  const { text, completed, category } = req.body;
  
  const updates = {};
  
  if (text !== undefined) {
    updates.text = text.trim();
  }
  
  if (completed !== undefined) {
    updates.completed = completed;
  }
  
  if (category !== undefined) {
    const validCategories = ['Я должен', 'Мне должны', 'Miscellaneous'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({ error: 'Valid category is required' });
    }
    updates.category = category;
  }
  
  try {
    const updatedTodo = await updateTodo(id, updates);
    res.json(updatedTodo);
  } catch (error) {
    console.error('Error updating todo:', error);
    if (error.message === 'Todo not found') {
      res.status(404).json({ error: 'Todo not found' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

app.delete('/api/todos/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    await deleteTodo(id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting todo:', error);
    if (error.message === 'Todo not found') {
      res.status(404).json({ error: 'Todo not found' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});