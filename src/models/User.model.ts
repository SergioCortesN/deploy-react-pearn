// src/models/User.model.ts (Archivo Nuevo)

import { Table, Column, Model, DataType, Default, BeforeCreate, BeforeUpdate } from "sequelize-typescript";
import bcrypt from 'bcryptjs';

@Table({
    tableName: "users",
    timestamps: true 
})
class User extends Model {
    @Column({
        type: DataType.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    })
    declare email: string; 

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare password: string;

    @BeforeCreate
    static async hashPasswordBeforeCreate(instance: User) {
        const salt = await bcrypt.genSalt(10);
        instance.password = await bcrypt.hash(instance.password, salt);
    }
    
    @BeforeUpdate
    static async hashPasswordBeforeUpdate(instance: User) {
        if (instance.changed('password')) {
            const salt = await bcrypt.genSalt(10);
            instance.password = await bcrypt.hash(instance.password, salt);
        }
    }

    // Método para comparar la contraseña
    async comparePassword(password: string): Promise<boolean> {
        return bcrypt.compare(password, this.password);
    }
}

export default User;