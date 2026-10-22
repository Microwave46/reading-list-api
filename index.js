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

let books = [
    {id:1, title: 'Atomic Habits', author: 'Jame Clear', status: 'reading'},
    {id:2, title: 'Clean Code', author: 'Robert C. Martin', status: 'todo'},
]
let nextId = 3;

app.get('/books', (req,res) =>{
    res.json(books)
});

app.get('/books/:id', (req,res) =>{
    const id = Number(req.params.id);
    const book = books.find((b)=>b.id===id);

    if(!book){
        return res.status(404).json({error: 'Book not found'});
    }
    res.json(book);
});

app.post('/books', (req, res) => {
    const { title, author } = req.body;

    if (!title || !author) {
        return res.status(400).json({ error: 'title and author are required' });
    }

    const newBook = { id: nextId++, title, author, status: 'todo' };
    books.push(newBook);
    res.status(201).json(newBook);
});

app.put('/books/:id', (req, res) => {
    const id = Number(req.params.id);
    const book = books.find((b)=>b.id===id);
    if(!book){
        return res.status(404).json({error: 'Book not found'});
    }
    const {title, author, status} = req.body;
    if (status !== undefined && !VALID_STATUS.includes(status)) {
        return res.status(400).json({ error: 'status must be todo, reading, or done' });
    }
    const updates = {title, author, status};
    Object.keys(updates).forEach((key) => {
        if (updates[key] !== undefined) book[key] = updates[key];
    });
    
    res.json(book)
});

app.delete('/books/:id', (req, res) => {
    const id = Number(req.params.id);
    const index = books.findIndex((b)=>b.id===id);
    if(index===-1){
        return res.status(404).json({error: 'Book not found'});
    }
    books.splice(index, 1);
    res.status(204).send();
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});