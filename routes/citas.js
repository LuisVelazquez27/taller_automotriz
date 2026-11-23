const express = require('express');
const router = express.Router();
const pool = require('../db');

/**
 * @swagger
 * tags:
 *   name: Citas
 *   description: Citas programadas (vehículo + mecánico + servicio)
 *
 * components:
 *   schemas:
 *     Cita:
 *       type: object
 *       properties:
 *         id_cita:
 *           type: integer
 *           example: 1
 *         fecha_hora:
 *           type: string
 *           example: "2026-12-01 09:00:00"
 *         id_vehiculo:
 *           type: integer
 *           example: 1
 *         id_mecanico:
 *           type: integer
 *           example: 7
 *         id_servicio:
 *           type: integer
 *           example: 1
 *     CitaInput:
 *       type: object
 *       required:
 *         - fecha_hora
 *         - id_vehiculo
 *         - id_mecanico
 *         - id_servicio
 *       properties:
 *         fecha_hora:
 *           type: string
 *           description: Fecha y hora programada (YYYY-MM-DD HH:MM)
 *           example: "2026-12-10 10:00"
 *         id_vehiculo:
 *           type: integer
 *           description: ID de un vehículo existente
 *           example: 3
 *         id_mecanico:
 *           type: integer
 *           description: ID de un mecánico existente
 *           example: 2
 *         id_servicio:
 *           type: integer
 *           description: ID de un servicio existente
 *           example: 3
 */

/**
 * @swagger
 * /api/citas:
 *   get:
 *     summary: Obtener todas las citas
 *     tags: [Citas]
 *     responses:
 *       200:
 *         description: Lista de citas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Cita'
 *       500:
 *         description: Error del servidor
 */
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM citas ORDER BY id_cita');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/citas/{id}:
 *   get:
 *     summary: Obtener una cita por su ID
 *     tags: [Citas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la cita
 *         example: 1
 *     responses:
 *       200:
 *         description: Cita encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cita'
 *       404:
 *         description: Cita no encontrada
 *       500:
 *         description: Error del servidor
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM citas WHERE id_cita = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ mensaje: 'Cita no encontrada' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/citas:
 *   post:
 *     summary: Agendar una nueva cita
 *     tags: [Citas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CitaInput'
 *     responses:
 *       201:
 *         description: Cita creada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cita'
 *       500:
 *         description: Error del servidor (por ejemplo, el vehículo, mecánico o servicio no existe)
 */
router.post('/', async (req, res) => {
  try {
    const { fecha_hora, id_vehiculo, id_mecanico, id_servicio } = req.body;
    const result = await pool.query(
      'INSERT INTO citas (fecha_hora, id_vehiculo, id_mecanico, id_servicio) VALUES ($1, $2, $3, $4) RETURNING *',
      [fecha_hora, id_vehiculo, id_mecanico, id_servicio]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/citas/{id}:
 *   put:
 *     summary: Actualizar una cita
 *     tags: [Citas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la cita
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CitaInput'
 *     responses:
 *       200:
 *         description: Cita actualizada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cita'
 *       404:
 *         description: Cita no encontrada
 *       500:
 *         description: Error del servidor
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { fecha_hora, id_vehiculo, id_mecanico, id_servicio } = req.body;
    const result = await pool.query(
      'UPDATE citas SET fecha_hora = $1, id_vehiculo = $2, id_mecanico = $3, id_servicio = $4 WHERE id_cita = $5 RETURNING *',
      [fecha_hora, id_vehiculo, id_mecanico, id_servicio, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ mensaje: 'Cita no encontrada' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/citas/{id}:
 *   delete:
 *     summary: Cancelar (eliminar) una cita
 *     tags: [Citas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la cita
 *     responses:
 *       200:
 *         description: Cita eliminada
 *       404:
 *         description: Cita no encontrada
 *       500:
 *         description: Error del servidor
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM citas WHERE id_cita = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ mensaje: 'Cita no encontrada' });
    }
    res.json({ mensaje: 'Cita eliminada', cita: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
