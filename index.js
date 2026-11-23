const path = require('path');
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const serviciosRoutes = require('./routes/servicios');
const mecanicosRoutes = require('./routes/mecanicos');
const vehiculosRoutes = require('./routes/vehiculos');
const citasRoutes = require('./routes/citas');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Configuración de Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API - Sistema de Citas, Refacciones y Expedientes para un Taller Automotriz',
      version: '1.0.0',
      description:
        'API REST para administrar los servicios, mecánicos, vehículos y citas de un taller automotriz. ' +
        'Permite realizar operaciones CRUD (GET, POST, PUT, DELETE) sobre cada tabla de la base de datos PostgreSQL.',
    },
    servers: [{ url: `http://localhost:${PORT}` }],
  },
  apis: [path.join(__dirname, 'routes', '*.js')], // archivos donde están los comentarios @swagger
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Rutas
app.use('/api/servicios', serviciosRoutes);
app.use('/api/mecanicos', mecanicosRoutes);
app.use('/api/vehiculos', vehiculosRoutes);
app.use('/api/citas', citasRoutes);

app.listen(PORT, (error) => {
  if (error) throw error; // por ejemplo, si el puerto ya está ocupado
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`Documentación Swagger en http://localhost:${PORT}/api-docs`);
});
