"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Classes extends Model {
    static associate(models) {
      this.belongsTo(models.User);
      this.hasMany(models.Students, {foreignKey: "classId"})
    }
  }
  Classes.init(
    {
      createdBy: DataTypes.STRING,
      className: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Classes",
    }
  );
  return Classes;
};