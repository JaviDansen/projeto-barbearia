const express = require('express');
const cors = require('cors'); 
const app = express();

const pool = require('./db');

const usersRoutes = require('./routes/users');
const servicesRoutes = require('./routes/services');
const employeesRoutes = require('./routes/employees');
const appointmentsRoutes = require('./routes/appointments');

app.use(cors({
  origin: 'http://localhost:5173'
})); 

app.use(express.json());
app.use(usersRoutes);
app.use(servicesRoutes);
app.use(employeesRoutes);
app.use(appointmentsRoutes);

app.get('/', (req, res) => {
  res.send('API Barbearia rodando 🚀');
});

module.exports = app;