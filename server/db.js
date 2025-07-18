const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

const createTodosTable = async () => {
  try {
    console.log('Testing database connection...');
    await pool.query('SELECT 1');
    console.log('Database connection successful');
    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS todos (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        text TEXT NOT NULL,
        category TEXT NOT NULL CHECK (category IN ('Я должен', 'Мне должны', 'Miscellaneous')),
        completed BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Todos table created or already exists');
  } catch (error) {
    console.error('Error creating todos table:', error);
    console.error('Database connection failed:', error.message);
  }
};

const getAllTodos = async () => {
  try {
    const result = await pool.query('SELECT * FROM todos ORDER BY created_at DESC');
    return result.rows.map(row => ({
      id: row.id,
      text: row.text,
      category: row.category,
      completed: row.completed,
      createdAt: row.created_at.toISOString()
    }));
  } catch (error) {
    console.error('Error getting todos:', error);
    throw error;
  }
};

const createTodo = async (text, category) => {
  try {
    const result = await pool.query(
      'INSERT INTO todos (text, category) VALUES ($1, $2) RETURNING *',
      [text, category]
    );
    const row = result.rows[0];
    return {
      id: row.id,
      text: row.text,
      category: row.category,
      completed: row.completed,
      createdAt: row.created_at.toISOString()
    };
  } catch (error) {
    console.error('Error creating todo:', error);
    throw error;
  }
};

const updateTodo = async (id, updates) => {
  try {
    const setParts = [];
    const values = [];
    let valueIndex = 1;

    if (updates.text !== undefined) {
      setParts.push(`text = $${valueIndex++}`);
      values.push(updates.text);
    }

    if (updates.completed !== undefined) {
      setParts.push(`completed = $${valueIndex++}`);
      values.push(updates.completed);
    }

    if (updates.category !== undefined) {
      setParts.push(`category = $${valueIndex++}`);
      values.push(updates.category);
    }

    if (setParts.length === 0) {
      throw new Error('No updates provided');
    }

    values.push(id);

    const result = await pool.query(
      `UPDATE todos SET ${setParts.join(', ')} WHERE id = $${valueIndex} RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      throw new Error('Todo not found');
    }

    const row = result.rows[0];
    return {
      id: row.id,
      text: row.text,
      category: row.category,
      completed: row.completed,
      createdAt: row.created_at.toISOString()
    };
  } catch (error) {
    console.error('Error updating todo:', error);
    throw error;
  }
};

const deleteTodo = async (id) => {
  try {
    const result = await pool.query('DELETE FROM todos WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      throw new Error('Todo not found');
    }
    return true;
  } catch (error) {
    console.error('Error deleting todo:', error);
    throw error;
  }
};

module.exports = {
  createTodosTable,
  getAllTodos,
  createTodo,
  updateTodo,
  deleteTodo
};