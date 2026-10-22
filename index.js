const express = require('express');
const app = express();

app.use(express.json()); 

app.get('/', (req, res) => {
  res.json({ message: 'Reading List API is running 📚' });
});

app.get('/health', (req, res) =>{
    res.json({ status: 'ok' })
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});