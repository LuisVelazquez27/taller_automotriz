const express = require('express');
const router = express.Router();
const pool = require('../db');

/**
 * @swagger
 * tags:
 *   name: Mecánicos
 *   description: Personal mecánico del taller
 *
 * components:
 *   schemas:
 *     Mecanico:
 *       type: object
 *       properties:
 *         id_mecanico:
 *           type: integer
 *           example: 1
 *         nombre:
 *           type: string
 *           example: Jorge Ramírez Torres
 *         especialidad:
 *           type: string
 *           example: Motor
 *         anios_experiencia:
 *           type: integer
 *           example: 15
 *     MecanicoInput:
 *       type: object
 *       required:
 *         - nombre
 *         - especialidad
 *         - anios_experiencia
 *       properties:
 *         nombre:
 *           type: string
 *           example: Pedro Gómez Salas
 *         especialidad:
 *           type: string
 *           example: Sistema eléctrico
 *         anios_experiencia:
 *           type: integer
 *           example: 5
 */

/**
 * @swagger
 * /api/mecanicos:
 *   get:
 *     summary: Obtener todos los mecánicos
 *     tags: [Mecánicos]
 *     responses:
 *       200:
 *         description: Lista de mecánicos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Mecanico'
 *       500:
 *         description: Error del servidor
 */
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM mecanicos ORDER BY id_mecanico');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/mecanicos/{id}:
 *   get:
 *     summary: Obtener un mecánico por su ID
 *     tags: [Mecánicos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del mecánico
 *         example: 1
 *     responses:
 *       200:
 *         description: Mecánico encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Mecanico'
 *       404:
 *         description: Mecánico no encontrado
 *       500:
 *         description: Error del servidor
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM mecanicos WHERE id_mecanico = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ mensaje: 'Mecánico no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/mecanicos:
 *   post:
 *     summary: Registrar un nuevo mecánico
 *     tags: [Mecánicos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MecanicoInput'
 *     responses:
 *       201:
 *         description: Mecánico creado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Mecanico'
 *       500:
 *         description: Error del servidor
 */
router.post('/', async (req, res) => {
  try {
    const { nombre, especialidad, anios_experiencia } = req.body;
    const result = await pool.query(
      'INSERT INTO mecanicos (nombre, especialidad, anios_experiencia) VALUES ($1, $2, $3) RETURNING *',
      [nombre, especialidad, anios_experiencia]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/mecanicos/{id}:
 *   put:
 *     summary: Actualizar un mecánico
 *     tags: [Mecánicos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del mecánico
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MecanicoInput'
 *     responses:
 *       200:
 *         description: Mecánico actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Mecanico'
 *       404:
 *         description: Mecánico no encontrado
 *       500:
 *         description: Error del servidor
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, especialidad, anios_experiencia } = req.body;
    const result = await pool.query(
      'UPDATE mecanicos SET nombre = $1, especialidad = $2, anios_experiencia = $3 WHERE id_mecanico = $4 RETURNING *',
      [nombre, especialidad, anios_experiencia, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ mensaje: 'Mecánico no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/mecanicos/{id}:
 *   delete:
 *     summary: Eliminar un mecánico
 *     tags: [Mecánicos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del mecánico
 *     responses:
 *       200:
 *         description: Mecánico eliminado
 *       404:
 *         description: Mecánico no encontrado
 *       500:
 *         description: Error del servidor (por ejemplo, el mecánico tiene citas asignadas)
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM mecanicos WHERE id_mecanico = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ mensaje: 'Mecánico no encontrado' });
    }
    res.json({ mensaje: 'Mecánico eliminado', mecanico: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
