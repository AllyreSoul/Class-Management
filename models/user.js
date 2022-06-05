'use strict';
const {Model} = require("sequelize")
module.exports = (sequelize, DataTypes) =>{
    class User extends Model{
        static associate(models) {
            this.hasMany(models.Classes, { foreignKey: "userId" });
          }
    }
    User.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
            },
            firstName: DataTypes.STRING,
            lastName: DataTypes.STRING,
            email: DataTypes.STRING,
            dob: DataTypes.DATE,
            gender: DataTypes.STRING,
            password: DataTypes.STRING
        },
        {
            sequelize,
            modelName: "User",
        }
    );
    return User;
};