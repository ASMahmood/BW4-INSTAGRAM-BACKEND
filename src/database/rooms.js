/** @format */

module.exports = (sequelize, DataTypes) => {
  const Rooms = sequelize.define("room", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    roomName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    messages: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
    users: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      allowNull: false,
    },
  });

  return Rooms;
};
