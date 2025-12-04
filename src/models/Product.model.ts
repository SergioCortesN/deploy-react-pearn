import { Table, Column, Model, DataType, Default } from "sequelize-typescript";

@Table({
    tableName: "products",
    timestamps: true 
})
class Product extends Model {
    @Column({
        type: DataType.STRING(100),
        allowNull: false 
    })
    declare name: string; 

    @Column({
        type: DataType.DECIMAL(6, 2),
        allowNull: false
    })
    declare price: number;

    @Default(true) 
    @Column({
        type: DataType.BOOLEAN
    })
    declare availability: boolean;
}

export default Product;