const express = require('express');
const router = express.Router();
const pool = require('../db');

/**
 * @swagger
 * tags:
 *   name: Vehículos
 *   description: Vehículos registrados en el taller
 *
 * components:
 *   schemas:
 *     Vehiculo:
 *       type: object
 *       properties:
 *         id_vehiculo:
 *           type: integer
 *           example: 1
 *         placas:
 *           type: string
 *           example: ABC-123-A
 *         marca:
 *           type: string
 *           example: Nissan
 *         modelo:
 *           type: string
 *           example: Versa
 *         anio:
 *           type: integer
 *           example: 2019
 *     VehiculoInput:
 *       type: object
 *       required:
 *         - placas
 *         - marca
 *         - modelo
 *         - anio
 *       properties:
 *         placas:
 *           type: string
 *           example: XYZ-321-M
 *         marca:
 *           type: string
 *           example: Toyota
 *         modelo:
 *           type: string
 *           example: Yaris
 *         anio:
 *           type: integer
 *           example: 2022
 */

/**
 * @swagger
 * /api/vehiculos:
 *   get:
 *     summary: Obtener todos los vehículos
 *     tags: [Vehículos]
 *     responses:
 *       200:
 *         description: Lista de vehículos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Vehiculo'
 *       500:
 *         description: Error del servidor
 */
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM vehiculos ORDER BY id_vehiculo');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/vehiculos/{id}:
 *   get:
 *     summary: Obtener un vehículo por su ID
 *     tags: [Vehículos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del vehículo
 *         example: 1
 *     responses:
 *       200:
 *         description: Vehículo encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Vehiculo'
 *       404:
 *         description: Vehículo no encontrado
 *       500:
 *         description: Error del servidor
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM vehiculos WHERE id_vehiculo = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ mensaje: 'Vehículo no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/vehiculos:
 *   post:
 *     summary: Registrar un nuevo vehículo
 *     tags: [Vehículos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VehiculoInput'
 *     responses:
 *       201:
 *         description: Vehículo creado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Vehiculo'
 *       500:
 *         description: Error del servidor (por ejemplo, placas duplicadas)
 */
router.post('/', async (req, res) => {
  try {
    const { placas, marca, modelo, anio } = req.body;
    const result = await pool.query(
      'INSERT INTO vehiculos (placas, marca, modelo, anio) VALUES ($1, $2, $3, $4) RETURNING *',
      [placas, marca, modelo, anio]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/vehiculos/{id}:
 *   put:
 *     summary: Actualizar un vehículo
 *     tags: [Vehículos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del vehículo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VehiculoInput'
 *     responses:
 *       200:
 *         description: Vehículo actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Vehiculo'
 *       404:
 *         description: Vehículo no encontrado
 *       500:
 *         description: Error del servidor
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { placas, marca, modelo, anio } = req.body;
    const result = await pool.query(
      'UPDATE vehiculos SET placas = $1, marca = $2, modelo = $3, anio = $4 WHERE id_vehiculo = $5 RETURNING *',
      [placas, marca, modelo, anio, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ mensaje: 'Vehículo no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/vehiculos/{id}:
 *   delete:
 *     summary: Eliminar un vehículo
 *     tags: [Vehículos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del vehículo
 *     responses:
 *       200:
 *         description: Vehículo eliminado
 *       404:
 *         description: Vehículo no encontrado
 *       500:
 *         description: Error del servidor (por ejemplo, el vehículo tiene citas registradas)
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM vehiculos WHERE id_vehiculo = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ mensaje: 'Vehículo no encontrado' });
    }
    res.json({ mensaje: 'Vehículo eliminado', vehiculo: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
