// src/config/db.ts (Modificado)

import { Sequelize } from 'sequelize-typescript';
import dotenv from 'dotenv';
import Product from '../models/Product.model';
import User from '../models/User.model';
import pg from 'pg';

dotenv.config();

// Configurar pg para que no use SSL como string, sino como objeto
if (process.env.NODE_ENV === 'production') {
    pg.defaults.ssl = {
        require: true,
        rejectUnauthorized: false
    };
}

// Limpiar la URL removiendo ?ssl=true 
const cleanDbUrl = (process.env.DATABASE_URL || '').replace(/\?ssl=true$/, '');

const db = new Sequelize(cleanDbUrl, {
    logging: false,
    dialect: 'postgres'
});

db.addModels([Product, User]);

export default db;