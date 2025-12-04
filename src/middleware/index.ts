// src/middleware/index.ts (Modificado)

import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator/lib/validation-result.js';
import { protect } from './auth'; // <-- NUEVO: Importar el middleware de protección

export const handleInputErrors = (req: Request, res: Response, next: NextFunction) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}

export {
    protect // <-- NUEVO: Exportar protect
}