// src/config/db.ts (Modificado)

import { Sequelize } from 'sequelize-typescript';
import dotenv from 'dotenv';
import Product from '../models/Product.model';
import User from '../models/User.model'; // <-- NUEVO

dotenv.config();

const db = new Sequelize(process.env.DATABASE_URL as string, {
    logging: false,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
});

db.addModels([Product, User]); // <-- AÑADIDO: User

export default db;