const express = require('express');
const connectDB = require('./db');
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const cors = require('cors'); // Import the cors middleware

const app = express();

connectDB();

app.use(express.json());
app.use(cors()); // Use the cors middleware to enable CORS

app.get('/', (req, res) => res.send('API Running'));
app.use('/api', authRoutes);
app.use('/task', taskRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
