// src/router.ts (Modificado)

import {Router} from 'express';
import { createProduct, deleteProduct, getProducts, getProductsById, updateAvailability, updateProduct } from './handlers/products';
import { login } from './handlers/auth'; // <-- NUEVO: Importar handler de login
import { body, param } from 'express-validator';
import { handleInputErrors, protect } from './middleware/index'; // <-- NUEVO: Importar protect

const router = Router();

/**
 * * =======================================================
 * RUTAS DE AUTENTICACIÓN (PÚBLICAS)
 * =======================================================
 * */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Iniciar sesión de usuario
 *     tags:
 *       - Authentication
 *     description: Permite a un usuario iniciar sesión y obtener un JWT.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@gmail.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso. Retorna JWT.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JSON Web Token
 *       401:
 *         description: Credenciales inválidas.
 */
router.post('/auth/login', 
    body('email').isEmail().withMessage('Email no válido'),
    body('password').notEmpty().withMessage('La contraseña es obligatoria'),
    handleInputErrors,
    login
);


/**
 * * =======================================================
 * RUTAS DE PRODUCTOS (PROTEGIDAS)
 * =======================================================
 * */
// Aplicamos el middleware 'protect' a todas las rutas de productos de aquí en adelante

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * security:
 *   - bearerAuth: []
 */

router.use('/products', protect); // <-- AÑADIDO: Aplica protección JWT a todas las rutas de /products

router.get('/products', getProducts);


router.get('/products/:id', 
    param('id').isInt().withMessage('ID must be a Integer'),
    handleInputErrors,
    getProductsById);


router.post('/products', 
    body('name').notEmpty().withMessage('Name is required'),
    body('price').isNumeric().withMessage('Price must be a number')
                  .notEmpty().withMessage('Price is required')
                  .custom((value) => value > 0).withMessage('Price must be greater than zero'),
    handleInputErrors,
    createProduct);


router.put('/products/:id',
    body('name').notEmpty().withMessage('Name is required'),
    body('price').isNumeric().withMessage('Price must be a number')
                  .notEmpty().withMessage('Price is required')
                  .custom((value) => value > 0).withMessage('Price must be greater than zero'),
    body('availability').isBoolean().withMessage('Availability must be a boolean'),
    param('id').isInt().withMessage('ID must be a Integer'),
    handleInputErrors,
    updateProduct);

router.delete('/products/:id', 
    param('id').isInt().withMessage('ID must be a Integer'),
    handleInputErrors,
    deleteProduct);


router.patch('/products/:id', 
    body('availability').isBoolean().withMessage('Availability must be a boolean'),
    param('id').isInt().withMessage('ID must be a Integer'),
    handleInputErrors,
    updateAvailability);

export default router;