// src/config/db.ts (Modificado)

import { Sequelize } from 'sequelize-typescript';
import dotenv from 'dotenv';
import Product from '../models/Product.model';
import User from '../models/User.model';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

// Parsear la URL y remover completamente el parámetro ssl
const dbUrl = new URL(process.env.DATABASE_URL!);
dbUrl.searchParams.delete('ssl'); // Eliminar el parámetro ssl de la query string

const db = new Sequelize(dbUrl.toString(), {
    logging: false,
    dialect: 'postgres',
    dialectOptions: isProduction ? {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    } : {}
});

db.addModels([Product, User]);

export default db;