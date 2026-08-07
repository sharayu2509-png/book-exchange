const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'Book Exchange API is running' });
});

app.get('/api/books', (_req, res) => {
  res.json([
    {
      id: 1,
      title: 'Data Structures Essentials',
      author: 'Aarav Sharma',
      subject: 'Data Structures',
      semester: '3rd',
      price: 450,
      exchangeAvailable: true,
      college: 'IIT Delhi',
      location: 'Delhi',
    },
  ]);
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
