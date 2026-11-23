// Configuración del Pool de conexión a PostgreSQL
const { Pool, types } = require('pg');

// Devolver TIMESTAMP tal como está guardado (sin convertir a UTC)
types.setTypeParser(1114, (valor) => valor);
// Devolver NUMERIC (costo_base) como número y no como texto
types.setTypeParser(1700, (valor) => parseFloat(valor));

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'taller_automotriz',
  password: process.env.DB_PASSWORD || 'postgres', // cambia por tu contraseña de PostgreSQL
  port: process.env.DB_PORT || 5432,
});

module.exports = pool;
