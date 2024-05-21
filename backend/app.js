const express = require('express');
const sequelize = require('./config/database');
const studentRoutes = require('./routes/studentRoutes');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors({
    origin: 'http://localhost:3000/', 
    credentials: true 
}));

app.use(express.json());

app.use('/api/students', studentRoutes);
app.use(bodyParser.json());


app.options('*', cors());
sequelize.sync()
    .then(() => {
        console.log('Database synced');
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch(error => console.error('Error syncing database:', error));
