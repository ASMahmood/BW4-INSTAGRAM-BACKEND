/** @format */

module.exports = (sequelize, DataTypes) => {
  const StoryAlbum = sequelize.define(
    "storyalbum",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      albumName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    { timestamps: true }
  );
  StoryAlbum.associate = (models) => {
    StoryAlbum.belongsTo(models.Story);
    StoryAlbum.belongsTo(models.User);
  };
  return StoryAlbum;
};
