const pool = require('./db');
const express = require('express');
const app = express();
const VALID_STATUS = ['todo', 'reading', 'done'];
app.use(express.json()); 

app.get('/', (req, res) => {
    res.json({ message: 'Reading List API is running 📚' });
});

app.get('/health', (req, res) =>{
    res.json({ status: 'ok' })
});

function parseId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

app.get('/books', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM books ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/books/:id', async (req, res) => {
  const id = parseId(req.params.id);
  if (id === null) {
    return res.status(400).json({ error: 'Invalid id' });
  }
  try {
    const result = await pool.query('SELECT * FROM books WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/books', async (req, res)=>{
  const { title, author } = req.body;
  if (!title || !author) {
      return res.status(400).json({ error: 'title and author are required' });
  }
  try{
    const result = await pool.query(
      'INSERT INTO books (title, author, status) VALUES ($1, $2, $3) RETURNING *',[title, author, 'todo']
    );
    const newBook = result.rows[0];
    res.status(201).json(newBook);
  }
  catch(err){
    console.error(err);
    res.status(500).json({ error: 'Internal server error'});
  }
});

app.put('/books/:id', async(req,res)=>{
  const id = parseId(req.params.id);
  if (id === null) {
    return res.status(400).json({ error: 'Invalid id' });
  }
  const { title, author, status} = req.body;
  if (status !== undefined && !VALID_STATUS.includes(status)) {
    return res.status(400).json({ error: 'status must be todo, reading, or done' });
  }
  try{
    const result = await pool.query(
      `UPDATE books 
        SET title = COALESCE($1, title),
        author = COALESCE($2, author),
        status = COALESCE($3, status)
        WHERE id = $4
        RETURNING *`,
      [title, author, status, id]
    );
    if (result.rows.length === 0) {return res.status(404).json({ error: 'Book not found' })}
    res.json(result.rows[0]);
  }
  catch(err){
    console.error(err);
    res.status(500).json({error: 'Internal server error'});
  }
});

app.delete('/books/:id', async(req, res)=>{
  const id = parseId(req.params.id);
  if (id === null) {
    return res.status(400).json({ error: 'Invalid id' });
  }
  try{
    const result = await pool.query('DELETE FROM books WHERE id = $1 RETURNING *',[id]);
    const deletedBook = result.rows[0];
    if(result.rows.length===0){return res.status(404).json({error: 'Book not found'})}
    res.status(204).send();
  }
  catch(err){
    console.error(err);
    res.status(500).json({error: 'Internal server error'});
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});