// src/handlers/auth.ts (AGREGANDO LOGS DE DIAGNÓSTICO)

import { Request, Response } from 'express';
import User from '../models/User.model';
import jwt from 'jsonwebtoken';
import colors from 'colors';

const JWT_SECRET = process.env.JWT_SECRET || 'CLAVE_SECRETA_POR_DEFECTO_MALA'; 

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    // --- LOGS DE DIAGNÓSTICO ---
    console.log(colors.yellow(`[LOGIN INTENTO] Email recibido: ${email}`));
    console.log(colors.yellow(`[LOGIN INTENTO] Password (plano, debería ser 123456): ${password}`));
    // ----------------------------

    // 1. Verificar si el usuario existe
    const user = await User.findOne({ where: { email } });

    if (!user) {
        console.log(colors.red(`[LOGIN FALLIDO] Usuario no encontrado: ${email}`));
        return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // --- LOGS DE DIAGNÓSTICO ---
    console.log(colors.cyan(`[LOGIN INFO] Usuario encontrado. Hash en BD: ${user.password}`));
    // ----------------------------

    // 2. Comparar la contraseña 
    const isMatch = await user.comparePassword(password); 

    if (!isMatch) {
        console.log(colors.red(`[LOGIN FALLIDO] Contraseña no coincide para: ${email}`));
        return res.status(401).json({ message: 'Credenciales inválidas' });
    }
    
    // --- LOGS DE DIAGNÓSTICO ---
    console.log(colors.green(`[LOGIN EXITOSO] Autenticación correcta para: ${email}`));
    // ----------------------------

    const token = jwt.sign(
        { id: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: '1h' } 
    );

    return res.json({ token, message: 'Inicio de sesión exitoso' });
};