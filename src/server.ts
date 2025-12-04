// src/server.ts (Modificado)

import express from 'express';
import cors, {CorsOptions} from 'cors';
import morgan from 'morgan';
import router from './router';
import db from './config/db';
import colors from 'colors';
import swaggerUi from 'swagger-ui-express'
import swaggerSpec, { swaggerUiOptions} from './config/swagger';

// Initialize database connection
export async function connectDB() {
    try {
        await db.authenticate();
        await db.sync(); // Asegura que la tabla 'users' se cree si no existe
        console.log(colors.blue.bold('Conexion exitosa a la BD. Tablas sincronizadas.'));
    } catch (error) {
        console.log(colors.red.bold('Hubo un error al conectar a la BD'));
    }
}
connectDB();

// Creatze Express server
const server = express();

//CORS 
const corsOptions : CorsOptions = {
    origin: function(origin, callback) {
        // Permitir requests sin origin (como Postman, mobile apps, etc)
        if (!origin) {
            return callback(null, true);
        }
        
        const allowedOrigins = process.env.FRONTEND_URL 
            ? process.env.FRONTEND_URL.split(',').map(url => url.trim())
            : [];
        
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('No permitido por CORS'));
        }
    },
    credentials: true
} 
server.use(cors(corsOptions));

// leer JSON
server.use(express.json());

server.use(morgan('dev'));

// Routing: Usa el router global para todas las rutas API
server.use('/api', router); // <-- CAMBIO CLAVE: Usar /api para incluir auth y products

//Docs
server.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec,swaggerUiOptions));

export default server;