const express = require('express');
const router = express.Router();
const pool = require('../db');

/**
 * @swagger
 * tags:
 *   name: Servicios
 *   description: Catálogo de servicios que ofrece el taller
 *
 * components:
 *   schemas:
 *     Servicio:
 *       type: object
 *       properties:
 *         id_servicio:
 *           type: integer
 *           example: 1
 *         nombre_servicio:
 *           type: string
 *           example: Afinación mayor
 *         costo_base:
 *           type: number
 *           example: 1800.00
 *         tiempo_estimado_min:
 *           type: integer
 *           description: Tiempo estimado en minutos
 *           example: 180
 *     ServicioInput:
 *       type: object
 *       required:
 *         - nombre_servicio
 *         - costo_base
 *         - tiempo_estimado_min
 *       properties:
 *         nombre_servicio:
 *           type: string
 *           example: Cambio de bujías
 *         costo_base:
 *           type: number
 *           example: 750.00
 *         tiempo_estimado_min:
 *           type: integer
 *           example: 60
 */

/**
 * @swagger
 * /api/servicios:
 *   get:
 *     summary: Obtener todos los servicios
 *     tags: [Servicios]
 *     responses:
 *       200:
 *         description: Lista de servicios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Servicio'
 *       500:
 *         description: Error del servidor
 */
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM servicios ORDER BY id_servicio');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/servicios/{id}:
 *   get:
 *     summary: Obtener un servicio por su ID
 *     tags: [Servicios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del servicio
 *         example: 1
 *     responses:
 *       200:
 *         description: Servicio encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Servicio'
 *       404:
 *         description: Servicio no encontrado
 *       500:
 *         description: Error del servidor
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM servicios WHERE id_servicio = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ mensaje: 'Servicio no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/servicios:
 *   post:
 *     summary: Registrar un nuevo servicio
 *     tags: [Servicios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ServicioInput'
 *     responses:
 *       201:
 *         description: Servicio creado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Servicio'
 *       500:
 *         description: Error del servidor
 */
router.post('/', async (req, res) => {
  try {
    const { nombre_servicio, costo_base, tiempo_estimado_min } = req.body;
    const result = await pool.query(
      'INSERT INTO servicios (nombre_servicio, costo_base, tiempo_estimado_min) VALUES ($1, $2, $3) RETURNING *',
      [nombre_servicio, costo_base, tiempo_estimado_min]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/servicios/{id}:
 *   put:
 *     summary: Actualizar un servicio
 *     tags: [Servicios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del servicio
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ServicioInput'
 *     responses:
 *       200:
 *         description: Servicio actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Servicio'
 *       404:
 *         description: Servicio no encontrado
 *       500:
 *         description: Error del servidor
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre_servicio, costo_base, tiempo_estimado_min } = req.body;
    const result = await pool.query(
      'UPDATE servicios SET nombre_servicio = $1, costo_base = $2, tiempo_estimado_min = $3 WHERE id_servicio = $4 RETURNING *',
      [nombre_servicio, costo_base, tiempo_estimado_min, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ mensaje: 'Servicio no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/servicios/{id}:
 *   delete:
 *     summary: Eliminar un servicio
 *     tags: [Servicios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del servicio
 *     responses:
 *       200:
 *         description: Servicio eliminado
 *       404:
 *         description: Servicio no encontrado
 *       500:
 *         description: Error del servidor (por ejemplo, el servicio tiene citas asociadas)
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM servicios WHERE id_servicio = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ mensaje: 'Servicio no encontrado' });
    }
    res.json({ mensaje: 'Servicio eliminado', servicio: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
