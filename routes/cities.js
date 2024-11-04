const express = require('express');
const fs = require('fs');
const router = express.Router();
const path = require('path');

// Ruta al archivo JSON
const jsonFilePath = path.join(__dirname, '..', 'mocks', 'cities.json');

// Función para cargar el archivo JSON
const loadStates = () => {
    return new Promise((resolve, reject) => {
      fs.readFile(jsonFilePath, 'utf8', (err, jsonData) => {
        if (err) {
          reject(err);
        } else {
          resolve(JSON.parse(jsonData));
        }
      });
    });
  };


/**
 * @swagger
 * /states:
 *   get:
 *     summary: Get states list
 *     description: Retrieve a paginated list of states
 *     tags: [cities]
 *     responses:
 *       '200':
 *         description: Lista de estados obtenida exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: '001'
 *                       state:
 *                         type: string
 *                         example: 'California'
 *       '500':
 *         description: Error al cargar los estados.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Error loading states
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       state:
 *                         type: string
 * 
 * /cities/{id}:
 *   get:
 *     summary: Get cities list by state code
 *     description: Retrieve a paginated list of cities for a given state
 *     tags: [cities]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del estado para el cual se desean obtener las ciudades.
 *     responses:
 *       '200':
 *         description: Lista de ciudades obtenida exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: '1001'
 *                       city:
 *                         type: string
 *                         example: 'Los Angeles'
 *       '500':
 *         description: Error al cargar las ciudades.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_code:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Error loading cities
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       city:
 *                         type: string
 */


// Ruta para obtener todos los departamentos
router.get('/states', async (req, res, next) => {
    try {
        const municipios = await loadStates();
        const uniqueStates = {};
        municipios.data.forEach(item => {
            if (!uniqueStates[item.state_dane_code]) {
                uniqueStates[item.state_dane_code] = item.state;
            }
        });
        const states = Object.keys(uniqueStates).map(stateCode => ({
            id: stateCode,
            state: uniqueStates[stateCode]
        }));
        res.json({
            status_code: 200,
            message: "success",
            data: states
        });
    } catch (error) {
        console.error("Error loading states:", error);
        next(error); // Pasar el error al middleware de manejo de errores
    }
});

// Ruta todas las ciudades con el parámetro ID del estado
router.get('/cities/:id', async (req, res, next) => {
    const stateId = req.params.id;
    try {
        const municipios = await loadStates();
        const cities = municipios.data.filter(item => item.state_dane_code === stateId).map(item => ({ id: item.city_dane_code, city: item.city }));
        res.json({
            status_code: 200,
            message: "success",
            data: cities
        });
    } catch (error) {
        next(error); // Pasar el error al middleware de manejo de errores
    }
});

module.exports = router;