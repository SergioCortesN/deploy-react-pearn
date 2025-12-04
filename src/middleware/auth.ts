// src/middleware/auth.ts (Archivo Nuevo)

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import colors from 'colors';

// Extender el objeto Request para inyectar los datos del usuario
export interface AuthenticatedRequest extends Request {
    user?: {
        id: number;
        email: string;
    };
}

// Utiliza una variable de entorno para la clave secreta
const JWT_SECRET = process.env.JWT_SECRET || 'CLAVE_SECRETA_POR_DEFECTO_MALA'; 

export const protect = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    let token;

    // 1. Leer el token del encabezado (Authorization: Bearer <token>)
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        // En un entorno real, es mejor usar un logger
        console.log(colors.red('Acceso denegado: No hay token')); 
        return res.status(401).json({ message: 'No autorizado, no se proporcionó token' });
    }

    try {
        // 2. Verificar el token
        const decoded = jwt.verify(token, JWT_SECRET) as { id: number, email: string };
        
        // 3. Adjuntar el payload del usuario a la solicitud
        req.user = decoded;

        next();
    } catch (error) {
        console.log(colors.red('Token inválido o expirado'));
        return res.status(401).json({ message: 'Token inválido o expirado' });
    }
};