// src/config/db.ts (Modificado)

import { Sequelize } from 'sequelize-typescript';
import dotenv from 'dotenv';
import Product from '../models/Product.model';
import User from '../models/User.model'; // <-- NUEVO

dotenv.config();

// Eliminar ?ssl=true de la URL si existe
const dbUrl = process.env.DATABASE_URL?.replace('?ssl=true', '') as string;

const db = new Sequelize(dbUrl, {
    logging: false,
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
});

db.addModels([Product, User]); // <-- AÑADIDO: User

export default db;