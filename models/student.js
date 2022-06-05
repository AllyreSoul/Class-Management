"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Students extends Model {
    static associate(models) {
      this.belongsTo(models.Classes);
    }
  }
  Students.init(
    {
      studentName: DataTypes.STRING,
      studentGender: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Students",
    }
  );
  return Students;
};