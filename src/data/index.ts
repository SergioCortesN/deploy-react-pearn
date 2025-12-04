// src/data/index.ts (MODIFICADO)

import { exit } from "node:process"
import db from "../config/db"
import User from "../models/User.model"
// Eliminamos la importación de bcrypt aquí. El modelo lo maneja.

const ADMIN_EMAIL = 'admin@gmail.com';
const ADMIN_PASSWORD = '123456'; // Contraseña en texto plano

const seedDB = async () => {
    try {
        // Creamos el usuario con la contraseña PLANA. 
        // El hook BeforeCreate en User.model.ts se encargará de hashearla automáticamente.
        await User.create({
            email: ADMIN_EMAIL,
            // Importante: insertamos la contraseña en texto plano
            password: ADMIN_PASSWORD, 
        });
        
        console.log("Usuario admin creado correctamente (hasheado por hook del modelo).");
    } catch (error) {
        console.error("Error al crear usuario admin:", error);
        exit(1);
    }
}


const clearDB = async () => {
    try {
        // 1. Forzar la eliminación de todas las tablas y recrearlas (incluyendo 'users')
        await db.sync({ force: true }) 
        
        // 2. Ejecutar el seeder después de la limpieza
        await seedDB(); 
        
        console.log("Base de datos borrada y sembrada correctamente.");
        exit(0)
    } catch (error) {
        console.error("Error durante el borrado y sembrado:", error);
        exit(1)
    }
}

if(process.argv[2] === '--clear') {
    clearDB();
} else if (process.argv[2] === '--seed') {
    seedDB();
}