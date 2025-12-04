// src/config/db.ts (Modificado)

import { Sequelize } from 'sequelize-typescript';
import dotenv from 'dotenv';
import Product from '../models/Product.model';
import User from '../models/User.model';

dotenv.config();

// Limpiar la URL removiendo ?ssl=true ya que lo configuraremos manualmente
const cleanDbUrl = (process.env.DATABASE_URL || '').replace(/\?ssl=true$/, '');

const db = new Sequelize(cleanDbUrl, {
    logging: false,
    dialect: 'postgres',
    dialectOptions: {
        ssl: process.env.NODE_ENV === 'production' ? {
            require: true,
            rejectUnauthorized: false
        } : false
    }
});

db.addModels([Product, User]);

export default db;